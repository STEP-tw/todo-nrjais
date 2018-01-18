const fs = require('fs');
const DefaultHandler = require('./defaultHandler');

class StaticFileHandler extends DefaultHandler{
  constructor(root, fileSystem = fs){
    super();
    this.root = root;
    this.fs = fs;
  }

  execute(req,res){
    let fileName = this.root + req.url;
    if (req.method == 'GET' ) {
      try {
        let content = this.fs.readFileSync(fileName);
        this.setHeader(res, fileName);
        res.write(content);
        res.end();
      } catch (error) {
        return ;
      }
    }
  }
  getHeader(fileName){
    let extension = fileName.slice(fileName.lastIndexOf('.'));
    let headers = {
      '.css': 'text/css',
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.jpg': 'image/jpg',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf'
    }
    return headers[extension];
  }
  setHeader(res, fileName) {
    let header = this.getHeader(fileName);
    if (header)
      res.setHeader('Content-Type', header);
  }
}

module.exports = StaticFileHandler;