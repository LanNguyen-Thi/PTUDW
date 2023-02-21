function populateTable(data, itable) {
  for (x in data) {
    var table = document.getElementById(itable);
    for (y in x) {
      var textNode = document.createTextNode(y);
      cellNode.appendChild(textNode);
      rowNode.appendChild(cellNode);
    }
    table.appendChild(rowNode);
  }
}
function populateTableWithClass(data, item, classnode)//classnode là danh sách class của từng node trong row
//số lượng class phải <= số lượng node trong row
{
  for (x in data) {
    key1 = Object.keys(data);
    var item = document.getElementById(item);
    var tr = classnode["0"];
    for (var x = 0; x < key1.length; x++) {
      level1 = data[key1[x]];
      var div = document.createElement("tr");
      div.classList.add(tr);
      key2 = Object.keys(level1);
      for (i = 0; i < key2.length; i++) {
        var para = document.createElement("td");
        level2 = level1[key2[i]];
        para.innerHTML = level2;
        para.classList.add(classnode[(i + 1).toString()]);
        div.appendChild(para)
      }
      item.appendChild(div);
    }
  }
}
function populateDivWithClass(data, item, classnode)//classnode là danh sách class của từng node trong row
//số lượng class phải <= số lượng node trong row
{
  key1 = Object.keys(data);
  console.log(key1);
  var item = document.getElementById(item);
  var cl = classnode["0"];
  for (var x = 0; x < key1.length; x++) {
    console.log(key1[x]);
    level1 = data[key1[x]];
    var div = document.createElement("div");
    div.classList.add(cl);
    key2 = Object.keys(level1);
    for (i = 0; i < key2.length; i++) {
      var para = document.createElement("p");
      level2 = level1[key2[i]];
      para.innerHTML = level2;
      para.classList.add(classnode[(i + 1).toString()]);
      div.appendChild(para)
    }

    item.appendChild(div);
  }
}
function previewImage(idHinh, idInput) {
  const preview = $(idHinh);
  const file = $(idInput).files[0];
  const reader = new FileReader();

  reader.addEventListener("load", function () {
    // convert image file to base64 string
    preview.src = reader.result;
    preview.classList.remove("hidden")

  }, false);
}
function fillKH(data,HienThi) {
  var stringHtml=""
  for (x in data)
  {

  }
  stringHtml+="<form action="+"'/admin/approveCourse'"+"method="+"'post"+
    "id="+"'frmApproveCourse"+data.idKhoaHoc+"'"+">"+
    "<input type="+"'hidden'"+ "name="+"'HienThi'"+ "value="+"'"+HienThi+"'"+
      "id="+"'HienThi"+data.idKhoaHoc+"'"+">"+
      "<input type="+"'hidden'"+"name="+"'IdKhoaHoc'" +"value="+"'"+data.idKhoaHoc+"'"+
        "id="+"'IdKhoaHoc"+data.idKhoaHoc+"'"+">"+
                                    "</form>"+
      "<form action="+"'/admin/deleteCourse'"+ "method="+"'post'"+ "id="+"'frmDelCourse"+data.idKhoaHoc+"'"+">"+
        "<input type="+"'hidden'" + "name="+"'IdKhoaHoc'"+ "id="+"'"+data.idKhoaHoc+"'"+">"+
          "<tr class="+"'"+data.LinhVuc+"'"+">"+
            "<th>"+data.idKhoaHoc+"</th>"
            "<th>"+data.TenKhoaHoc+"</th>"
            "<th>"+data.ChuDe+"</th>"
            "<th>"+data.TenGiangVien+"</th>"
            "<th>"+data.LastUpdate+"</th>"

            "<th><a class="+"'text-danger'"+"href="+"'/admin/allcourses/detail/"+data.idKhoaHoc+"'"+">Xem chi tiết</a> </th>"+

            "<th><a data-id="+"'"+data.idKhoaHoc+"'"+ "href="+"'javascript:;'"+ "role="+"'button'"+
              "class="+"'btn  {{#if "+HienThi+"}}btn-info{{else}}btn-danger{{/if}} approveCourse'"+">"+
              "{{ #if "+HienThi+"}}<i class="+"'fas fa-lock-open'"+"></i>{{ else}}<i"+
                "class="+"'fas fa-lock'"+"></i>{{/if}}</a></th>"+

            "<th><a data-id="+"'"+data.idKhoaHoc+"'" +"href="+"'javascript:;'"+"role="+"'button'"+
              "class="+"'btn btn-danger delCourse'"+">Delete</a></th>"
          "</tr>"
                                    "</form>"
  $('#tableKH').innerHTML=stringHtml;
}
function fillNumberButton(number) {
  var stringHtml=""
  for (i=0; i<Math.ceil(number/20);i++)
  {
    stringHtml+="<button type= "+"'button' " + "class="+"'btn btn-primary'"+"id="+"'button"+i+"'"+">"+i+"</button>";
    console.log($("#buttongr"))
  }
  $("#buttongr").innerHTML+=stringHtml;
  for (i=0; i<Math.ceil(number/20);i++)
  {
  $('#button'+i).on('click',function()
    {
      var number=this.innerHTML;
      showCourses(number);
    })
  }
}