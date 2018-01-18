class DefaultHandler{
  constructor(){
  }
  execute(){}
  getRequestHandler(){
    return this.execute.bind(this);
  }
}

module.exports = DefaultHandler;