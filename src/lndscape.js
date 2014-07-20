/*
 * Lndscape
 */
(function(window){ function f(){
define("lndscape",[],function()
{
    console.log('defining lndscape');
    
    this._size=size;
    this._heightmap=null;
    
    function smooth(fsize)
    {
        var count=0.0;
        var total=0.0;

        for(var x=0,xl=_heightmap.length;x<xl;x++)
        {
            for(var y=0,yl=_heightmap[x].length;y<yl;y++)
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

                        total += _heightmap[x0][y0];
                        count++;
                    }
                }

                if(count !== 0 && total !== 0.0)
                {
                    _heightmap[x][y]=total/count;
                }
            }
        }
    }
})}});
