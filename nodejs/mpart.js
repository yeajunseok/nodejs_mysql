var M = {
  v:'v',
  f:function(){
    console.log(this.v);
  }
}

module.exports = M; //M객체를 모듈 밖에서 사용할 수 있게
