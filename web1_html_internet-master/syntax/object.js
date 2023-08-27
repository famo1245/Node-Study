const roles = {
  programmer: 'kim',
  designer: 'park',
  manager: 'lee',
};

// console.log(roles.designer);
// console.log(roles['designer']);

// object의 순회 -> key 값이 출력됨
for (let name in roles) {
  console.log('object =>', name, 'value =>', roles[name]);
}
