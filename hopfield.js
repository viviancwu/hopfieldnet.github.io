
function hopfield(){
    for(let i=1; i<11; i++){
        for(let j=1; j<11; j++){
            var position = i+","+j;
            var cb = document.getElementById(position).checked;
            if(cb){
                matrix[i-1][j-1]=-1;
            }
            else{
                matrix[i-1][j-1]=1;
            }
        }
    }
    //must reshape sheesh

    let newMatrix = reshape(matrix);
    //my new n size=100, it becomes an 100x1 matrix

    //generate weights
    let weight = new Array(10);
    for(let i=0; i<100; i++){
        weight[i]=new Array(100);
        weight[i].fill(0);
    }
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
    //.log(weight);
    //add noise
    var noiseLevel = document.getElementById("noiselevel").value;
    var p_val = noiseLevel/100;
    let results1 = new Array(mem.length).fill(0);
    var mem_test = JSON.parse(JSON.stringify(matrix));
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

    //recall origianl memory
    var mem_work = reshape(mem_test);
    let results2 = new Array(mem.length).fill(0);
    let inside = new Array(10).fill(0);
    let mem_rec = new Array(10).fill(inside);
    //var mem_work = JSON.parse(JSON.stringify(mem_test));
        let s = new Array(100).fill(0);
        //let s_old = mem_work;
        let n_iters =0;
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
           /* for(let i=0; i<10; i++){
                mem_work[i][m]=s[i];
            }*/
            n_iters++;
            let count=0;
            for(let i=0; i<100; i++){
                if(newMatrix[i]==s[i]){
                    count++;
                }
            }
            console.log(s);
            console.log(newMatrix);
            if(count==100){
                go=false;
            }
            mem_work=s;
        }
        const arrayColumn = (arr, n) => arr.map(x=>x[n]);
        //results2[m]=hamming_distance(s, arrayColumn(matrix, m));
        //s should now be the same as my old Matrix
       /* for(let i=0; i<10; i++){
            mem_rec[i][m]=s[i];
        }
    console.log(results2);*/
    console.log(s);
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
    }

    //plot initial
    var xInitial = [];
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

    Plotly.newPlot('myPlot1', data, layout);

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
    Plotly.newPlot('myPlot2',data2, layout2);

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
    
    Plotly.newPlot('myPlot3',data3, layout3);

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