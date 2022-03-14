const fs = require('fs');

const handleEnvFileCreation = () => {
  const envPath = `${__dirname}/../.env`;

  if (!fs.existsSync(envPath)) {
    fs.copyFileSync(`${__dirname}/../.env.example`, envPath);
  }
}

handleEnvFileCreation()
