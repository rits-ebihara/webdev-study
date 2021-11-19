const sleep = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

const promises = [];
promises.push(sleep(5000).then(() => "p1"));
promises.push(sleep(1000).then(() => "p2"));
promises.push(sleep(6000).then(() => "p5"));
Promise.all(promises).then((results) => {
  console.log(results);
});

// const fn = async () => {
//   const array = [3000, 2000, 1000];
//   array.forEach(async (item, index) => {
//     await sleep(item); // Promise 関数
//     console.log(`${index} 完了`);
//   });
// };

// const fn = () => {
//   (async () => {
//     await sleep(3000); // Promise 関数
//     console.log(`1 完了`);
//   })(); // 関数の即時実行
//   (async () => {
//     await sleep(2000); // Promise 関数
//     console.log(`2 完了`);
//   })(); // 関数の即時実行
//   (async () => {
//     await sleep(1000); // Promise 関数
//     console.log(`3 完了`);
//   })(); // 関数の即時実行
// };

const array = [3000, 2000, 1000];
const fn = async () => {
  for (const [index, item] of array.entries()) {
    await sleep(item); // Promise 関数
    console.log(`${index} 完了`);
  }
};

fn();
