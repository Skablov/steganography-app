let date = new Date();
const errorHandler = (fs, err) =>  {
    const fileName = `./logs/${date.getDate()}:${date.getMonth() + 1}:${date.getFullYear()}`;
    alert(err.message);
    fs.appendFileSync(fileName, `${err.stack}\n`);
}
