
/**
 * Created by edgarisla1 on 1/21/16.
 */


var  ref= new Firebase("https://luminous-torch-9391.firebaseio.com/");
ref.authWithPassWord({
    email:"edgar.isla.2015@gmail.com",
    password: "ogden2011!!"

},function(error,authData){
//user authenticated
});