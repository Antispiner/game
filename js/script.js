

function sel_all(){
   if( !document.form_name1.cheks ) return;
   if( !document.form_name1.cheks.length )
      document.form_name1.cheks.checked = document.form_name1.cheks.checked ? false : true;
   else
      for(var i=0;i<document.form_name1.cheks.length;i++)
         document.form_name1.cheks[i].checked = document.form_name1.cheks[i].checked ? false : true;
}