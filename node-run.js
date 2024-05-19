const dotenv = require('dotenv');
const child_process = require('child_process');

const config = dotenv.config()
const PORT = process.env.PORT || 4200;

const child = child_process.exec(`ng serve --configuration=production --port=${PORT}`);
child.stderr.on('data', err => console.error(err));
child.stdout.on('data', data => console.log(data.toString()));