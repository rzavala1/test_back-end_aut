const express=require('express');
const routerApi=require("./routes");
const app=express();
const port=3001;

const cors = require('cors');
app.use(cors());

app.use(express.json());

routerApi(app);

app.listen(port,()=>{
  console.log("Run Port "+port);
});
