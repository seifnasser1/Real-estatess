import Propirty from '../models/propirty.model.js';
import __dirname from '../app.js'
import wishlist from '../models/wishlist.model.js';
import User from '../models/user.model.js';
import fileUpload from "express-fileupload";
import { login } from './user.controller.js';

const profilewishlist= (req, res,next) => {
  var query = { "_id": req.params.id };
  const arr=[];
  User.find(query)
    .then(result1 => {
  wishlist.find({"userid":req.params.id}).then(async result=>{
  console.log(result);
  if(result.length>0){
  for(var i=0;i<result.length;i++){
    const prop=await Propirty.findOne({"_id":result[i].propertyid})
      arr[i]=prop;
    }
  }
   res.render('pages/profile', { User: result1[0], wish : arr , user: (req.session.user === undefined ? "" : req.session.user)});
}).catch(err1 => {
  console.log(err1);
});
})
    .catch(err => {
      console.log(err);
    });
};

const getTopSalesProperties = async (req, res) => {
  const Property = require('/models/propirty.model');
  try {
    // Fetch properties from the database
    const properties = await Property.find().sort({ value: -1 }).limit(5);

    res.render('admin-dashboard', { properties }); // Pass the properties to the template
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
};

const viewproperty= async (req, res,next) => {
  var query = { "_id": req.params.id };
  var value;
  const exsistingwishlist = await wishlist.findOne({"userid":req.session.user._id,"propertyid":req.params.id});
  if(exsistingwishlist==null){
    value=1;
  }else{
    value=2;
  }
  Propirty.find(query)
    .then(result => { 
      console.log(value);
      res.render('pages/villa', { Propirty: result[0],v:value ,user: (req.session.user === undefined ? "" : req.session.user)});
    })
    .catch(err => {
      console.log(err);
    });
};
const addprop = async (req, res, next) => {
  let imgFile;
  let uploadPath;
  console.log(req.files)
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }
  imgFile = req.files.img;

  uploadPath = './public/img/' + req.body.name + '.jpg';
  // Use the mv() method to place the file somewhere on your server
  imgFile.mv(uploadPath, function (err) {
    if (err)
      return res.status(500).send(err);

    console.log(req.session.user.id);
    const propirty = new Propirty({
      name: req.body.name,
      mobilenumber: req.body.mobile_number,
      mobilenumber2: req.body.other_number,
      email: req.session.user.email,
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
      adminid:req.session.user._id,
        });
    propirty.save()
      .then(result => {
        console.log('unit added succesfully');
        res.redirect('/admin');
      })
      .catch(err => {
        console.log(err);
      });
  });

};
const Search = async (req, res, next) => {
  console.log(req.body);
  const { Status, Type, Area, Price, Bedrooms, Bathrooms, Parks } = req.body;
  // price

  const query = {};

  if (Status) query.servicetype = Status;
  if (Type) query.unittype = Type;
  if (Area) query.area = Area;
  if (Price) {
    const price = parseInt(Price);
    if (price === 1)
    query.value = {
      $gte: 1000000,
    };
  else if (price === 2)
    query.value = {
      $gte: 500000,
      $lt: 1000000,
    };
  else
    query.value = {
      $lt: 500000,
    };
  }
  if (Bedrooms) {
    const bedrooms = parseInt(Bedrooms);
    if (bedrooms === 1) query.bedrooms = 1;
    else query.bedrooms = { $gte: 2 };
  }
  if (Bathrooms) {
    const bathrooms = parseInt(Bathrooms);
    if (bathrooms === 1) query.bathrooms = 1;
    else query.bathrooms = { $gte: 2 };
  }
  if (Parks) {
    const parks = parseInt(Parks);
    if (parks === 1) query.parks = 1;
    else query.parks = { $gte: 2 };
  }

  Propirty.find(query)
    .then((result) => {
      console.log(result);
      res.render("pages/All", {
        propirty: result,
        user: req.session.user === undefined ? "" : req.session.user,
      });
    })
    .catch((err) => console.log(err));
};

//navsearch
const navsearch = async (req, res, next) => {
  const { searchtext } = req.query;
  console.log(searchtext);
  const regex = new RegExp(`.*${(searchtext || "").toLowerCase()}.*`, "ig");
  console.log(regex);
  const query = {
    $or: [
      { type: regex },
      { name: regex },
      { servicetype: regex },
      { unittype: regex },
      { district: regex },
      { area: regex },
      { furniture: regex },
      { details: regex },
    ],
  };
  Propirty.find(query)
    .then((result) => {
      console.log("HELLo");
      res.render("pages/All", {
        propirty: result,
        user: req.session.user === undefined ? "" : req.session.user,
      });
    })
    .catch((err) => console.log(err));
};

const addwishlist = async (req, res, next) => {
  const exsistingwishlist = await wishlist.findOne({
    username: req.session.user.id,
    property: req.body.Propirty,
  });
  var found;
  if (exsistingwishlist) {
    wishlist.findByIdAndDelete(exsistingwishlist._id);
    res.redirect("/", {
      user: req.session.user === undefined ? "" : req.session.user,
    });
  } else {
    const wish = new wishlist({
      username: req.session.user.id,
      property: req.body.Propirty,
    });
    console.log(wish);
    wish.save().then((result) => {
      res.redirect("/", { user: req.session.user === undefined ? "" : req.session.user });
      })
      .catch((err) => console.log(err));
  }
}


export {
  addprop,
  addwishlist,
  navsearch,
  viewproperty,
  profilewishlist,
};
