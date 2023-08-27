// function a() {
//   console.log('A');
// }

const a = () => {
  console.log('A');
};

function slowfunc(callback) {
  callback();
}

slowfunc(a);
