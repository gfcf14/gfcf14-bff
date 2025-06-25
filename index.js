const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('GFCF14 BFF is live');
});

async function startServer() {
  const port = process.env.PORT || 5000;
  app.listen({ port }, () =>
    console.log(`✨ Server ready at http://localhost:${port}`)
  );
}

startServer();