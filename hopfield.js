
function hopfield(){
    var number = document.getElementById("memorysize").value;



    var matrix = new Array(10);
    for(let i=0; i<10; i++){
        matrix[i]=new Array(10);
        matrix[i].fill(0);
    }
    for(var k=1; k<=number; k++){
    for(let i=1; i<11; i++){
        for(let j=1; j<11; j++){
            var position = k+","+i+","+j;
            var cb = document.getElementById(position).checked;
            if(cb){
                matrix[i-1][j-1]=-1;
            }
            else{
                matrix[i-1][j-1]=1;
            }
        }
        }
        window["matrix"+k] = JSON.parse(JSON.stringify(matrix));
    }
    //must reshape sheesh
    for(let i=1; i<=number; i++){
        eval('var matrix = matrix'+i+';');
        let newMatrix = reshape(matrix);
        window["newMatrix"+i] = JSON.parse(JSON.stringify(newMatrix));

    }
    //my new n size=100, it becomes an 100x1 matrix

    //generate weights
    let weight = new Array(10);
    for(let i=0; i<100; i++){
        weight[i]=new Array(100);
        weight[i].fill(0);
    }
    for(let k=1; k<=number; k++){
    eval('var newMatrix = newMatrix'+k+';');
    for(let i=0; i<100; i++){
        for(let j=0; j<100; j++){
            let waux=0;
            for(let m=0; m<1; m++){
                waux += newMatrix[i]*newMatrix[j];
            }
            waux = waux/1;
            weight[i][j]=waux;
            weight[j][i]=waux;
        }
        weight[i][i]=0;
    }
    window["weight"+k] = JSON.parse(JSON.stringify(weight));
 
}
    //.log(weight);
    //add noise
    var noiseLevel = document.getElementById("noiselevel").value;
    var p_val = noiseLevel/100;
    let results1 = new Array(mem.length).fill(0);
    for(let k=1; k<=number; k++){
    eval('var mem_test = JSON.parse(JSON.stringify(matrix'+k+'));');
    eval('var matrix = matrix'+k+';');
    var countReplacements=0;
    for(let i=0; i<10; i++){
        for(let j=0; j<10; j++){
            if(Math.random()<p_val){
                mem_test[j][i]=-mem_test[j][i];
                countReplacements++;
            }
            else{
                mem_test[j][i]=mem_test[j][i];
            }
        }
        const arrayColumn = (arr, n) => arr.map(x=>x[n]);
        results1[i]=hamming_distance(arrayColumn(mem_test, i), arrayColumn(matrix,i));
    }
    window["mem_test"+k] = JSON.parse(JSON.stringify(mem_test));
}


    //recall origianl memory
    for(var i=1; i<=number; i++){
        eval('var mem_work'+i+'= reshape(mem_test'+i+');')
    }
    //iterate through all the weights and see which one it's able to recall
    let results2 = new Array(mem.length).fill(0);
    let inside = new Array(10).fill(0);
        //let s_old = mem_work;
        let n_iters =0;
        //for(var k=1; k<=number; k++){
            whichmem=0;
            min=Infinity;
            newmin=0;
            //eval('var mem_work = mem_work'+k+';');
        for(var p=1; p<=number; p++){
        let s = new Array(100).fill(0);
        eval('var newMatrix = newMatrix'+p+';');
        eval('var matrix = matrix'+p+';');
        eval('weight = weight'+p+';');
        eval('var mem_work = mem_work'+p+';');
        let s_old = mem_work;
        let go=true;

        while(go){
            for(let i=0; i<100; i++){
                let waux=0;
                for(let j=0; j<100; j++){
                    waux = waux+weight[i][j]*mem_work[j];
                }
                s[i]=waux;
            }
            for(let n=0; n<100; n++){
                if(s[n]>0){
                    s[n]=1;
                }
                else if(s[n]<1){
                    s[n]=-1;
                }
            }
            mem_work = JSON.parse(JSON.stringify(s));
            var count=0;
            for(let i=0; i<100; i++){
                if(s_old[i]==s[i]){
                    count++;
                }
                else{
                    break;
                }
            }
            if(count==100){
                go=false;
            }
            s_old=s;
        }
        const arrayColumn = (arr, n) => arr.map(x=>x[n]);
        var distance = hamming_distance(s, newMatrix);
        console.log(distance);
        if(distance<min){
            min=distance;
            whichmem=p;
        }
        let m=0;
        let matrixback = new Array(10);
        for(let i=0; i<10; i++){
            matrixback[i]=new Array(10).fill(0);
        }
        for(let i=0; i<10; i++){
            for(let j=0; j<10; j++){
                matrixback[i][j]=s[m];
                m++;
            }
        }
        eval('var matrixback'+p+'= matrixback;');
    }

        //const arrayColumn = (arr, n) => arr.map(x=>x[n]);
        //results2[m]=hamming_distance(s, arrayColumn(matrix, m));
        //s should now be the same as my old Matrix
       /* for(let i=0; i<10; i++){
            mem_rec[i][m]=s[i];
        }
    console.log(results2);*/
   /* console.log(s);
    var m=0;
    let matrixback = new Array(10);
    for(let i=0; i<10; i++){
        matrixback[i]=new Array(10).fill(0);
    }
    for(let i=0; i<10; i++){
        for(let j=0; j<10; j++){
            matrixback[i][j]=s[m];
            m++;
        }
    }*/

    //plot 
    for(let k=1; k<=number; k++){
    eval('var matrix = matrix'+k+';');
    eval('var mem_test = mem_test'+k+';');
    eval('var matrixback = matrixback'+k+';');
    var xInitial= [];
    var yInitial=[];
    var xNoise=[]; 
    var yNoise=[];
    var xBack = [];
    var yBack= [];
    for(var i=0; i<10; i++){
        for(var j=0; j<10; j++){
            if (matrix[i][j]==-1){
                xInitial.push(j);
                yInitial.push(10-i);
            }
            if(mem_test[i][j]==-1){
                xNoise.push(j);
                yNoise.push(10-i);
            }
            if(matrixback[i][j]==-1){
                xBack.push(j);
                yBack.push(10-i);
            }
        }
    }
    let data = [{
        x: xInitial,
        y: yInitial,
        mode: "markers",
        type: "scatter"
    }];
    
    let layout = {
        xaxis:{
            range: [0,10]
        },
        yaxis: {
            range: [0,10]
        },
        title:"original pattern"
    };

    let config = {
        responsive:true,
    };

    Plotly.newPlot('myPlot'+k+'.1', data, layout);

    //plot with noise
    let data2 =[{
        x: xNoise,
        y: yNoise,
        mode:"markers",
        type:"scatter"
    }];

    let layout2 = {
        xaxis:{
            range:[0,10]
        },
        yaxis:{
            range:[0,10]
        },
        title:"Corrupted Patteerns"
    };
    let config2 = {
        responsive:true,
    };
    Plotly.newPlot('myPlot'+k+'.2',data2, layout2);

    //plot matrixback
    let data3 = [{
        x: xBack,
        y: yBack,
        mode:"markers",
        type:"scatter"
    }];
    let layout3 = {
        xaxis:{
            range:[0,10]
        },
        yaxis:{
            range:[0,10]
        },
        title:"Recovered Patterns"
    };
    
    Plotly.newPlot('myPlot'+k+'.3',data3, layout3);

    }
    
}
 


function hamming_distance(m1, m2){
    let inside = new Array(1).fill(0);
    let d =0;
        for(var j=0; j<10; j++){
            if(m1[j]==-1){
                m1[j]=0;
            }
            if(m2[j]==-1){
                m2[j]=0;
            }
            let absvalue = parseInt(m1[j])-parseInt(m2[j]);
            d+=Math.abs(absvalue);
        }
    return d;
}

function reshape(matrix){
    let size1 = matrix.length;
    let size2 = matrix[0].length;
    let j = 0;
    let q = 0;

    let newy = size2*size2;
    let newx = size1/size2;
    //var reshapedinside = new Array(1).fill(0);
    var reshaped = new Array(100).fill(0);
        for(let m=0; m<100; m++){
            reshaped[m]=matrix[j][q];
            q++;
            if(q==10){
                q=0;
                j++;
            }
        }
    return reshaped;

}

var matrix = [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

function determine(){
    var value=document.getElementById("memorysize").value;
    console.lot(value);
    var i=1;
    for(i; i<value; i++){
        document.getElementById("mem"+value).style.display="block";
    }
    for(i; i<11; i++){
        document.getElementById("mem"+value).style.display="none";
    }
}

