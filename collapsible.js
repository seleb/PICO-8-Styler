function refreshCollapsibles(){
	openAccordion(null, true);
}

function openAccordion(target, force){
	if(!$(target).parent().hasClass("hold-open")){
		$(".section-content").each(function(index){
			if(!$(this).parent().hasClass("hold-open")){
				$(this).slideUp( force === true ? 0 : 400, function(){
					$(this).prev().find(".indicator").html("+");
					$(this).parent().removeClass("section-open")
				});
			}
		});

		if(target != null){
			if(!$(target).parent().hasClass("section-open")){
				$(target).parent().addClass("section-open");
				$(target).next().slideDown( force === true ? 0 : Math.min(1500, Math.max($(target).parent().find(".section-content").html().length/3, 400)), function(){
					$(target).find(".indicator").html("-");
				});
			}
		}
	}
}


$(document).on("click", ".section-header", function(){
	openAccordion(this);
});