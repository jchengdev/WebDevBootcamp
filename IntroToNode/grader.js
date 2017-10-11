function average(arr){
    if (Array.isArray(arr)) {
        let sum=0;
		for (let i=arr.length-1; i >= 0; i--) {
		    if(typeof arr[i] === "number"){
		        sum += arr[i];
		    }
		    else console.log("array["+i+"] is not of number type");
		}
		return Math.round(sum/arr.length);
		
	}
	else console.log("argument is not of Array type");

	console.log("************************************************");
}

function main(){
    var scores = [90,98,89,100,100,86,94];
    console.log(average(scores));
    
    var scores2 = [40,65,77,82,80,54,73,63,95,49];
    console.log(average(scores2));
}

main();