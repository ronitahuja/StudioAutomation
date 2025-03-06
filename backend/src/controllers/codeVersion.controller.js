const codeVersionRepository = require("../repositories/codeVersion.repository");
const codeVersionService = require("../services/codeVersion.service");

const codeVersionService=new codeVersionService(new codeVersionRepository());

