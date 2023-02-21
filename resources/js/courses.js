
function allcourses(item,cl)
{
    $.ajax({
        url:"/teacher/allmycourses",
        type:"POST",
        dataType:"json",
        success: function(data)
        {   
            populateTableWithClass(data,item,cl)
        }
    });
}