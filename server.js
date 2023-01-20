import { App } from "./index.js";
import { sequelize } from "./databases.js";
import { Config } from "./src/config/config.js";


sequelize.authenticate().then(function(){
    console.log("success");
  }).catch(function(error){
    console.log("error: "+error);
});


App.listen(Config.PORT,() => {
    console.log(`http://localhost:${Config.PORT}`)
})