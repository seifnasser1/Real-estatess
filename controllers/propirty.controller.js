import Propirty from '../models/propirty.model.js';
import __dirname from '../app.js'

import fileUpload from "express-fileupload";



const addprop = async (req, res, next) => {
   let imgFile;
   let uploadPath;
   console.log(req.files)
   if (!req.files || Object.keys(req.files).length === 0) {
     return res.status(400).send('No files were uploaded.');
   }
   imgFile = req.files.img;
   uploadPath = './public/img/' + req.body.name +'.jpg';
   // Use the mv() method to place the file somewhere on your server
   imgFile.mv(uploadPath, function (err) {
     if (err)
       return res.status(500).send(err);
   
   console.log(req.body);
     const propirty = new Propirty({
      name: req.body.name,
      mobilenumber: req.body.mobile_number,
      mobilenumber2: req.body.other_number,
      email: req.body.name,
      servicetype: req.body.servise,
      unittype: req.body.type,
      district: req.body.district,
      garages: req.body.garage,
      area: req.body.area,
      value: req.body.vale,
      unumber: req.body.u_nom,
      bathrooms: req.body.u_path,
      bedrooms: req.body.u_bed,
      furniture: req.body.f_type,
      details: req.body.details,
      Image: req.body.name + '.jpg',
     });
     propirty.save()
       .then(result => {
         res.render('pages/adminHeader');
       })
       .catch(err => {
         console.log(err);
       });
   });
   
  };

  export { addprop};