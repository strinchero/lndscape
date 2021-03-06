/*
 * Lndscape
 */
(function(){

define("lndscape/goo",["goo/addons/terrainpack/TerrainSurface"],function(TerrainSurface)
{
    return function(goo,size,height){
    
        this._goo=goo;
        this._size=size;
        this._height=height;
        this._heightmap=null;
        this._surface = null;
        
        this.getHeightmap = function()
        {
            return this._heightmap;
        }
        
        this.getSurface = function()
        {
            if(this._surface === null)
            {
                var terrain = new TerrainSurface(this._heightmap,this._size,this._height,this._size);
                _surface = terrain.rebuild();
            }
            
            return this._surface;
        }
        
        this.generateMultiPassHeightMap = function (steps,smoothPass,smoothSize) {

            var scale = steps * 4;
            var matrix = [];

            // Step 0: base matrix

            console.log('step 0')

            for (var i = 0; i < this._size; i++) {
                    matrix.push([]);
                    for (var j = 0; j < this._size; j++) {
                            var v = (this._goo.ValueNoise.evaluate2d(i,j,scale) * 3);
                            matrix[i].push(v);
                    }
            }

            // Step 1-N: delta steps

            for(var s=1; s < steps-1; s++)
            {
                console.log('step ' + s);

                scale = scale/2;
                var reduce = s*2;

                for (var i = 0; i <this._size; i++) 
                {
                    for (var j = 0; j < this._size; j++) 
                    {
                        var v = goo.ValueNoise.evaluate2d(i,j,scale) / reduce;
                        matrix[i][j]+=v;
                    }
                }
            }

            console.log('last step ' + s);

            scale = scale/2;
            var reduce = (steps-1)*2;
            var maxVal = -1.0;
            var minVal = 1000000000000;

            for (var i = 0; i < this._size; i++) 
            {
                for (var j = 0; j < this._size; j++) 
                {
                    var v = goo.ValueNoise.evaluate2d(i,j,scale) / reduce;
                    var nv = matrix[i][j]+v;
                    matrix[i][j]=nv;

                    if(nv > maxVal)
                    {
                        maxVal = nv;
                    }
                    else if(nv < minVal)
                    {
                        minVal = nv;
                    }
                }
            }

            // Smoothing

            this._heightmap = matrix;

            for(var s=0;s<smoothPass;s++)
            {
                this.smooth(smoothSize);
            }

            // Normalize and dec

            var k = maxVal - minVal;

            for (var i = 0; i < this._size; i++)
            {
                for (var j = 0; j < this._size; j++) 
                {
                    var nv = matrix[i][j];
                    nv = ((nv - minVal)/k) - 0.1; // 10% underwater

                    matrix[i][j] = nv;
                }
            }
        }        
    
        this.smooth = function(fsize)
        {
            var count=0.0;
            var total=0.0;
            var hmap=this._heightmap;            

            for(var x=0,xl=hmap.length;x<xl;x++)
            {
                for(var y=0,yl=hmap.length;y<yl;y++)
                {
                    count=0.0;
                    total=0.0;

                    for(var x0 = x - fsize; x0 < x+fsize; x0++)
                    {
                        if(x0 < 0 || x0 > xl-1)
                                continue;

                        for(var y0 = y - fsize; y0 < y + fsize; y0++)
                        {
                            if(y0 < 0 || y0 > yl-1)
                            continue;

                            total += hmap[x0][y0];
                            count++;
                        }
                    }

                    if(count !== 0 && total !== 0.0)
                    {
                        hmap[x][y]=total/count;
                    }
                }
            }
        }
    };
    });
})();
