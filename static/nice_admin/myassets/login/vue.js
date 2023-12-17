export default function (data){
    return new Vue({
        data : data,
        el : "#Form",
        template : `

<form class="row g-3 needs-validation" novalidate>

<div class="col-12">
  <label for="yourUsername" class="form-label">Username</label>
  <div class="input-group has-validation">
    <input type="text" name="username" class="form-control" id="yourUsername" required>
    <div class="invalid-feedback">Please enter your username.</div>
  </div>
</div>

<div class="col-12">
  <label for="yourPassword" class="form-label">Password</label>
  <input type="password" name="password" class="form-control" id="yourPassword" required>
  <div class="invalid-feedback">Please enter your password!</div>
</div>

<div class="col-12">
  <label for="yourCaptcha" class="form-label">Captcha</label>
  <img style="display : block;" v-bind:src="captcha"/>
  <input type="text" name="captcha" class="form-control" id="yourCaptcha" required>
  <div class="invalid-feedback">Please enter your password!</div>
</div>

<div class="col-12">
  <button class="btn btn-primary  w-100" v-on:click="login" type="button">Login</button>
</div>
</form>
        
        `,
        methods : {
            login : function(){
                $.ajax({
                    data : $(this.$el).serialize(),
                    url : this.$data.app_path+"login",
                    method : "POST",
                    success : (data)=>{
                        var jsdata = JSON.parse(data);
                        if(!jsdata.success){
                        toastr["error"](jsdata.message)
                            this.$data.captcha = jsdata.captcha;
                        } else {
                            toastr["success"](jsdata.message);
                            window.location = this.$data.app_path;
                        }
                    }
                });
            }
        }
    });
}