const fs = require("fs");
const path = require("path");

function formatDate() {
  const now = new Date();
  return now.toISOString().replace("T", " ").slice(0, 19);
}

function logMiddleware(req, res, next) {
  const logMessage = `[${formatDate()}] - ${req.method} ${req.path}\n`;

  console.log(logMessage.trim());

  next();
}

module.exports = logMiddleware;
