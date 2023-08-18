const joi = require("joi");
const expressJoi = function (schema) {
  return function (req, res, next) {
    // console.log(req.body);

    ["body", "query", "params"].forEach((item) => {
      if (!schema[item]) {
        return;
      }
      //校验
      const schemas = joi.object(schema[item]);

      const { error, value } = schemas.validate(req[item]);

      if (error) {
        throw error;
      } else {
        req[item] = value;
      }
    });
    next();
  };
};
// const expressJoi = function(req,res,next){

//             //校验
//             const schemas = joi.object({
//                 username:joi.string().min(1).max(10).required(),
//                 password:joi.string().pattern(/^[\S]{6,12}$/).required()
//             });
//             // console.log(schema[key])
//             const {error,value} = schemas.validate(req.body);
//             // console.log(error)
//             // debugger;
//             if(error){
//                 throw error
//             }else{
//                 req.body = value;
//             }

//         next();

// }
module.exports = expressJoi;
