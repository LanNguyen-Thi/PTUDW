function addLevel1Catagory()
{
    $.ajax(
        {
            url:"/admin/addcategories",
            type:"POST",
            dataType:"JSON",
            data:{level:1,ma:$("#inputMaLinhVuc"),ten:$("#inputTenLinhVuc")},
            success: function (data)
            {
                $("#notiLabel").html(data.body.result);
            }
        }
    )
}
function addLevel2Catagory()
{
    $.ajax(
        {
            url:"/admin/addcategories",
            type:"POST",
            dataType:"JSON",
            data:{level:2,malevel1:$("#inputLevel1"),ma:$("#inputMaLinhVuc"),ten:$("#inputTenLinhVuc")},
            success: function (data)
            {
                $("#notiLabel").html(data.body.result);
            }
        }
    )
}
