
    function atualizaSel(){
        var empresa = document.getElementById("empresa")
        var option1 = document.getElementsByTagName("option")
        var id_sel = "{{postagem.empresa._id}}"

    for(var i=0; i<option1.length; i++){
        if(option1[i].value == id_sel){
            option1[i].setAttribute("selected", "true")
        }
    }
    }
