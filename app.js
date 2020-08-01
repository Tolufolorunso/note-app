const PORT = 3000;

const app = require("./controller.js");

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
