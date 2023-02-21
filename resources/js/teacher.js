
function addTeacher(form)
{
    var formdata= new FormData();
    formdata.append('TenGiangVien',$('#inputTen').val());
    formdata.append('NgaySinh',$('#inputNgaySinh').val());
    formdata.append('MoTa',$('#inputMota').val());
    formdata.append('HinhDaiDien',$('#inputHinh').file[0],'HinhDaiDien');
    formdata.append('Email',$('#inputEmail').val());
    formdata.append('Username',$('#inputUsername').val());
    formdata.append('Password',$('#inputPassword').val());
    $.ajax({
        url:"/admin/add-teacher",
            type:"POST",
            data:formdata,
            dataType:false,
            success: function(data){
                $("#uploadLabel").html(data.result);
            }
    })
}