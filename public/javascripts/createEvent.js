/**
 * Created by Kobe on 11/17/2016.
 */
//FORMS
var formResult = QueryStringToObj();
var resultDay;
var resultMonth;

function QueryStringToObj() {
    //?event_name=MyEvent&date=1990-12-24&startTime=11%3A11&endTime=14%3A22
    //slice the '?' and split items into an array by separating &
    var pairs = location.search.slice(1).split('&');
    var result = {};

    //for each element in the array, split the pair by = to separate key value pairs
    //assign them by name value pairs into the empty result object
    if(pairs.length > 1){
        pairs.forEach(function(pair) {
            pair = pair.split('=');

            if(result[pair[0]]){ //if the property exists

                if(typeof result[pair[0]] === 'object'){
                    result[pair[0]].push(pair[1])
                }
                else{
                    result[pair[0]] = [result[pair[0]], pair[1]]
                }
            }
            else{//if property dose not exist yet
                result[pair[0]] = pair[1] || '';
            }

        });

        resultDay   = new Date(result.date).getDate(); //Day of the result
        resultMonth = new Date(result.date).getMonth(); //Day of the result
    }
    else{
        result = null;
    }
    console.log(result)
    return result;
}
if(formResult){
    sidebarGet.innerHTML = '';
    (sidebarGet.getdays = function(){
        for (items in formResult){
            sidebarGet.innerHTML += ('<div>' + formResult[items] + '</div>')
        }
    }())
}