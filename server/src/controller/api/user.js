const request = require("request-promise");
const jsonwebtoken = require('jsonwebtoken');

module.exports = class extends think.Controller {
  async loginAction() {
    let { code, userInfo } = this.post();

    // 获取openid和session_key
    let options = {
      method: "GET",
      url: "https://api.weixin.qq.com/sns/jscode2session",
      qs: {
        grant_type: "authorization_code",
        js_code: code,
        appid: this.config("wx.appId"),
        secret: this.config("wx.appSecret")
      }
    }
    let loginInfo = await request(options);
    let openid = JSON.parse(loginInfo).openid;

    const result = await this.model('api/index').getUser({ openid: openid });
    if (result.length) {
      let token = this.getToken(result[0].openid);
      this.success(token, "登录成功");
    } else {
      let data = {
        openid: openid,
        user_name: userInfo.nickName,
        gender: userInfo.gender,
        avatar: userInfo.avatarUrl,
        country: userInfo.country,
        province: userInfo.province,
        city: userInfo.city,
        create_date: think.datetime(new Date())
      }
      const result = await this.model('api/index').createUser(data);
      let token = this.getToken(openid);
      this.success(token, "新用户登录");
    }
  }

  // 生成token
  getToken(openid) {
    const userInfo = {
      openid: openid
    };
    const { secret, appToken, expire } = this.config('jwt');
    // 生成token
    const token = jsonwebtoken.sign(userInfo, secret, { expiresIn: expire });
    this.cookie(appToken, token);
    return token;
  }
}