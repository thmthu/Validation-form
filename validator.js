function validator(options){

    var formElement= document.querySelector(options.form);
    var selectorRule={};

    function validate(inputElement,rule ) {
    
        var errorMessage;
        var errorElement=inputElement.parentElement.querySelector('.form_message');

        var rules=selectorRule[rule.selector];
        for(i=0;i<rules.length;i++){
            errorMessage=rules[i](inputElement.value);
            if(errorMessage) break;
        }

      
        if(errorMessage)
        {
         errorElement.innerText= errorMessage;
         inputElement.parentElement.classList.add('invalid');
        }
        else
        {
         errorElement.innerText='';
         inputElement.parentElement.classList.remove('invalid');
        }
        return !errorMessage;
     
     }

    if(formElement)
    {
       
        formElement.onsubmit=function(e){
            e.preventDefault();
            var isValid=true;
            options.rules.forEach(function(rule)
            {
               var inputElement= formElement.querySelector(rule.selector);
               var check= validate(inputElement,rule);
                
                if(!check) isValid=false;

            }
            )
            var a = document.querySelectorAll('[name]');
            if(isValid){
               var enableInput=document.querySelectorAll('[name]');
               var formValue=Array.from(enableInput).reduce(function(values,input)
               {
                console.log('day la' + input.name);
                return values[input.name]=input.value, values;
               },{});
               options.onSubmit(formValue);
            }
          

        }

        options.rules.forEach(function(rule)
        {
            var inputElement= formElement.querySelector(rule.selector);
            var errorElement=inputElement.parentElement.querySelector('.form_message');
            if(Array.isArray(selectorRule[rule.selector])){
                selectorRule[rule.selector].push(rule.test);
            }
            else{
                selectorRule[rule.selector]=[rule.test];
            }

            if(inputElement)
            {
               
                inputElement.onblur=function()
                {
                validate(inputElement,rule);
                }
                inputElement.oninput=function(){
                    errorElement.innerText='';
                    inputElement.parentElement.classList.remove('invalid');
                }

            }
        })
        //console.log(selectorRule);
    }
}


validator.isRequire= function(selector){
    return {
        selector: selector,
        test: function(value){
            return value.trim()?undefined:'Vui lòng nhập trường này';
        }
    }
}

validator.isEmail= function(selector){
    return {
        selector: selector,
        test: function(value){
            var regex= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ?undefined:'Trường này phải là email';
            
        }
    }
}

validator.isEnough= function(selector, min){
    return {
        selector: selector,
        test: function(value){
            return value.length>=min ?undefined:'Vui lòng nhập ít nhất 6 kí tự'
    }
}
}
validator.isConfirmed= function(selector, getPassword){
    return {
        selector: selector,
        test: function(value){
            return value===getPassword() ?undefined:'Mật khẩu không khớp, vui lòng nhập lại'
        }
    }
}