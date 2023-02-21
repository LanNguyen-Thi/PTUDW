function login(username,password,idLabel){
    if(username==='' || password==='')
    {
        $(idLabel).html('Tên đăng nhập hoặc mật khẩu không được trống');
        return false;
    }
    else
    {
            $.ajax({
            url:"/admin/login",
            type:"POST",
            data:{username:username,password:password},
            dataType:"json",
            success: function(data){
                $(idLabel).html(data.result);
            }
        });
        return false;
    }
}