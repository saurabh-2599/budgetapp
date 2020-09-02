//  module for calculating budget on data received from ui 
console.log("heybuddy");
var budgetController=(function(){
    //data structure for income and expense
    // constructor for all expense objects
    var Expense=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        this.percentage=-1;
    };
    //calculating percentage of each object added by adding method for each object in Expensw prototype
    Expense.prototype.calcPercentage=function(totalIncome){
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100);
        }
        else{
            this.percentage=-1;
        }
    };
    //adding another method for retrieving those percentage to be use in appController
    Expense.prototype.getPercentage=function(){
        return this.percentage;
    }
    //constructor for all income objects 
    var Income=function(id,description,value){
        this.id=id;
        this.description=description;
        this.value=value;
        
    };
    //store all incomes and expenses in array
    /* var allExpenses=[];
    var allIncomes=[];
    var total=0;
    instead of this store all data items in objects */
    var data={
        dataItems:{inc:[],
        exp:[]},
        total:{
            inc:0,
            exp:0
        },
        budget:0,
        percentage:-1

    };
    // making it private so that it is not accssible outside module
    var calculateTotal=function(type){
        var sum=0;
        data.dataItems[type].forEach(function(current){
        // calculate total income and expense
        // current.value denotes value of objects stored in income and expense array
            sum=sum+current.value;
            
        });
        data.total[type]=sum;
    }

    return{
        addItem:function(type,des,val){
        //creating new objects from constructor
        var newItem,ID;
        // adding only if array has some element into it
        if(data.dataItems[type].length>0){
        ID=data.dataItems[type][data.dataItems[type].length-1].id+1;
        }
        else{
            ID=0;
        }
        if(type==='exp'){
            newItem=new Expense(ID,des,val); 
        }
        else if(type==='inc'){
            newItem=new Income(ID,des,val);
        }
        // add new item in exp or inc array in dataItems object at the end
        data.dataItems[type].push(newItem);
        
        console.log(newItem);
        // return new item objects
        return newItem;

        },
        testing:function(){
            //testing if object is created or not
         console.log(data);
        },
        calculateBudget:function(){
            //1.calculate total income
            calculateTotal('inc');
            //2.calculate total expense
            calculateTotal('exp');
            //3.calculate total budget
            data.budget=data.total.inc-data.total.exp;
            //4.calculate percentage
            if(data.total.inc>0){
            data.percentage=(data.total.exp/data.total.inc)*100;
        }
    },
        getBudget:function(){
           return{
               budget:data.budget,
               percentage:data.percentage,
               totalInc:data.total.inc,
               totalExp:data.total.exp
           }

        },
        //calling method for each expense percentage calculation
        calculatePercentage:function(){
            data.dataItems.exp.forEach(function(current){
                current.calcPercentage(data.total.inc);
            });
        },
        //delete an item from our dataStucture
        deleteItem:function(type,id){
            //we need tro know type and which element should we delted thats why receiving type and id argumnet
            //forEach and map:map return complely new array after performing operation forEach cant
            var ids=data.dataItems[type].map(function(current){
              //should return all present id in array of that type array ie inc or exp
             return current.id;
            });
            //store index of all returned id so that we can delete particular element
            index=ids.indexOf(id);
            //here in this line id is what we receive from argument and ids is array of all ids in that type
            /* splice vs slice: slice return copy of an array and splice is for delete item */
            if(index !== -1){
                data.dataItems[type].splice(index,1);
            }
            
    
            },
        // calling method for retreiving each expense percentage
        retreivePercentage:function(){
            var allPercentages=data.dataItems.exp.map(function(current){
                return current.getPercentage();
            });
            return allPercentages;
        }
        
       
        
    
    



    }
    


})();






// UI module : module for receiving data from ui and display it on ui

var uiController=(function(){
    var domStrings={
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn',
        incomeList:'.income__list',
        expenseList:'.expenses__list',
        budgetLabel:'.budget__value',
        incomeLabel:'.budget__income--value',
        expenseLabel:'.budget__expenses--value',
        percentageLabel:'.budget__expenses--percentage',
        containerLabel:'.container',
        expensePercentageLabel:'.item__percentage',
        dateLabel:'.budget__title--month'
    };
/*
//whether expense or income is chosen
var type=document.QuerySelector('add--type').value;
//description of purpose of expense and income
var description=document.QuerySelector('add--description').value;
// taking how much money is spent or earned from ui
var money=document.QuerySelector('add--value').value;
since if we return it can return only one value thats why declaring it later in object getinput method*/
return{
    getInput:function(){
    //since want to use all three values so return it as an object
    return{
    type:document.querySelector(domStrings.inputType).value,
    description:document.querySelector(domStrings.inputDescription).value,
    //since this value is string so we need to convert it into float
    money:parseFloat(document.querySelector(domStrings.inputValue).value)
    }
     //since return only one value therefore...
    // return Dom strings
        
    },
    getDomStrings:function(){
        return domStrings;
    },
    addListItem:function(obj,type){
        var html,newHtml,element;

        if(type==='inc') 
        
        {   element=domStrings.incomeList;
            
            html='<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                        
    }
      else if(type==='exp'){
        element=domStrings.expenseList;
        
        html= '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage"></div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

      }
      newHtml=html.replace('%id%',obj.id);
      newHtml=newHtml.replace('%description%',obj.description);
      newHtml=newHtml.replace('%value%',obj.value);
      document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
       


},

      clearFields:function(){
          var fields;
          //return list in fields
          fields=document.querySelectorAll(domStrings.inputDescription+', '+domStrings.inputValue);
          //converting fileds intop array so that we can use slice method on it
          fieldsArr=Array.prototype.slice.call(fields);
          //for each to loop over array fieldsArr
          fieldsArr.forEach(function(current){
            
              current.value="";
          });
          fieldsArr[0].focus();
          
          
          
      },
      //this function display budget,item,expense,percentage in upper part of ui(global)
      displayBudget:function(obj){
       // displaying in upper part of our user interface 
       document.querySelector(domStrings.budgetLabel).textContent=obj.budget;
       document.querySelector(domStrings.incomeLabel).textContent=obj.totalInc;
       document.querySelector(domStrings.expenseLabel).textContent=obj.totalExp;
       if(obj.percentage>0){
       document.querySelector(domStrings.percentageLabel).style.visibility='visible';
       document.querySelector(domStrings.percentageLabel).textContent=Math.round(obj.percentage)+"%";

      }
      else{
          document.querySelector(domStrings.percentageLabel).style.visibility='hidden';
      }
    },
    //method to delete an item from lists
    deleteListItem:function(selectorId){
        var element;
        element=document.getElementById(selectorId);
        element.parentNode.removeChild(element);
    },
    displayPercentages:function(percentages){
     //selecting complete percentages array in one go 
     var fields=document.querySelectorAll(domStrings.expensePercentageLabel);
     // field will return list so it will only have length method cant use forEach or map
     // creating our own forEach for NodeLIst
     var nodeListForEach=function(list,callback){
         for(var i=0;i<list.length;i++){
             callback(list[i],i);
             //calling callback for each value of nodeList
         }
     };
     nodeListForEach(fields,function(current,index){
         //here function is callback function for nodelist and fields is the nodeList
         if(percentages[index]>0){
             current.textContent=percentages[index]+"%";
         }
         else{
             current.style.visibility='hidden';
         }
     });

    },
    displayDates:function(){
        var now=new Date();
        var months,month,year;
        months=["Jan","Feb","March","April","May","June","July","Aug","Sep","Oct","Nov","Dec"];
        month=now.getMonth();//return month number using 0 based array(starts from 0 ends with 11)
        year=now.getFullYear();
        //displaying it on ui
        document.querySelector(domStrings.dateLabel).textContent=months[month]+'-'+year;

    },
    changeButton:function(){
        document.querySelector(domStrings.inputBtn).classList.toggle('red');
    }
}
})();
//communication between budget and ui controller through module 'appController'
var appController=(function(bdgtCtrl,uiCtrl){
    //1.addeventlistener
    //all event listener in a function
    var setUpEventListener=function(){
        var DOMstrings=uiCtrl.getDomStrings();
        
        // add event listener on click button to take input
        document.querySelector(DOMstrings.inputBtn).addEventListener('click',ctrlAddItem);
        // for enter key perform same task as click button
        document.addEventListener('keypress',function(event){
            if(event.keycode==13 || event.which==13){
                ctrlAddItem();
            }
       
        });
        document.querySelector(DOMstrings.containerLabel).addEventListener('click',ctrlDeleteItem); 
        document.querySelector(DOMstrings.inputType).addEventListener('change',changeButton);

    }
    var changeButton=function(){
        uiCtrl.changeButton();
    }
    //calculate budget and update budget call
    var updateBudget=function(){
      //calculateBudget
      bdgtCtrl.calculateBudget();
      //return budget
      var budget=bdgtCtrl.getBudget();
      // display the budget onb ui
      uiCtrl.displayBudget(budget);
    
    }
    var updatePercentages=function(){
        //calling to calculate percentage for each expense
        bdgtCtrl.calculatePercentage();
        // retreiving array of all percentages in expenseList
       var percentages= bdgtCtrl.retreivePercentage();
        uiCtrl.displayPercentages(percentages);
    };

    
    //2.Take input from user we are calling setup event listener later so this function expression will be available
    /* in order to take input from user we have to communicate with uiController so this module(uiController) should return
    public object through iifes */
    var ctrlAddItem=function(){
        var input,newItem;
        //1.take input fro user
        input=uiCtrl.getInput();
        //2.addinvg item in budgetController module 
        newItem=bdgtCtrl.addItem(input.type,input.description,input.money)
        //3. displaying added object in income and expense container
        uiCtrl.addListItem(newItem,input.type);
        //4. clearing fields'
        uiCtrl.clearFields();
        // calculate and update budget eaCH TIME input a new item
        updateBudget();
        updatePercentages();
        }
    var ctrlDeleteItem=function(event){

  var itemId;
  //we are adding it on button bcause if we click somewhere else we will not get Id
  itemId=event.target.parentNode.parentNode.parentNode.parentNode.id;

 
  //delete that item of that particular id if id exist
  if(itemId){
      // braking inc-0 into inc and 0
     var splitID,type,ID;
     splitID=itemId.split('-');
     //type of that particular element that we want to delete
     type=splitID[0];
     ID=parseInt(splitID[1]);
    
     //since Id is string we need to convert it into string
//delete that item form datastructure
//delete that item from ui
//uodate and show new budget

  }
 //delete an item from datastructure from particular list and having specific id
 bdgtCtrl.deleteItem(type,ID);
 
 //delete that item from Ui
 uiCtrl.deleteListItem(itemId);
 //updating budget again
 updateBudget();


    }




   
    
   
    //return event listener function outside
    return{
        //each time init is called application is reset
        init:function(){
            //calling display dates
            uiCtrl.displayDates();
            //displaying budget when app is loaded
            uiCtrl.displayBudget({
                  budget:0,
                  totalInc:0,
                  totalExp:0,
                  percentage:-1

            });
            setUpEventListener();
                   
        },
    }



})(budgetController,uiController);
//calling event listener function
appController.init();