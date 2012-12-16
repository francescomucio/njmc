	$.urlParam = function(name){
		var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
		return results[1] || 0;
	}
	
	function onSave(){
		
		var badges = '';
		
		$.each($('#currentBadges_content').children().find('.badgeId').text(), function(i, testo){
			badges += testo + ',';
		});
		
		badges = badges.substr(0, badges.length - 1);
		console.log(badges);
		
		$.post(	"savebadges.php", 
				{ 	
					linkedin_id: $.urlParam('linkedin-id'), 
					badges: badges 
				},
				function(data) {
						alert('Badge saved');
				}
		);
		
		
		$('#buttonSave').removeClass('active').attr("disabled", true);
		$('#buttonCancel').removeClass('active').attr("disabled", true);	
	}
	
	// Remove the badge and in case shows again the placeholder
	function removeBadge (index) {
		$('#currentBadges_content').find('#'+'badge_'+ index).remove();
		$('#buttonSave').addClass('active').removeAttr('disabled');
		$('#buttonCancel').addClass('active').removeAttr('disabled');
		
		if ($('#currentBadges_content').children().length <= 1) $('#currentBadges_placeholder').show();
	}
	
	// Let's build a badge among the available ones
	function buildBadge(index, badge_id, title, desc, imageUrl) {
		// There is a div
		var badge = $('<div/>', {
						id: 'badge_'+ index,
						class: 'badge',
						title: desc // this is the tooltip ;)
					}
		).draggable({ // draggable to the whole page
            appendTo: 'body',
            helper: 'clone'
        }).append(	$(	'<img/>', // 1. it contains an image
							{
								id:	'badgeImg_' + index,
								class: 'badgeImg',
								src: imageUrl
							}
						)
		).append(	$(	'<div/>', // 2. a div with the title
							{
								id:	'badgeTitle_' + index,
								class: 'badgeTitle',
								html: title
							}
						)
				).append(	$(	'<div/>', // 3. a div with the id, that I will use to delete the badge
							{
								id:	'badgeId_' + index,
								class: 'badgeId',
								html: badge_id
							}
						)
				);
						
		return badge;
	}
	
	function buildBadge_dropped(index, badge_id, title, desc, imageUrl) {
		var badge = $('<div/>', {
						id: 'badge_'+ index,
						class: 'badge',
						title: desc
					}
		).append(	$(	'<img/>',
						{
							id:	'badgeImg_' + index,
							class: 'badgeImg',
							src: imageUrl
						}
					)
		).append(	$(	'<div/>',
						{
							id:	'badgeTitle_' + index,
							class: 'badgeTitle',
							html: title
						}
					)
		).append(	$(	'<div/>',
						{
							id:	'badgeId_' + index,
							class: 'badgeId',
							html: badge_id
						}
					)
		).append(	$(	'<img/>', 
						{
							src: '../images/delete.png',
							class: 'badgeDelete'
						}
					).click(function(){removeBadge (index);
									}
							)
		);
						
		return badge;
	}
	
	function onDrop(ui) {
                $('#currentBadges_placeholder').hide();

				// variables for the badge definition
				var droppedBadge = $(ui.draggable);
				var index = droppedBadge.find('img').attr('id').replace('badgeImg_','');
				var badgeName = droppedBadge.find('div').html();
				var badgeDesc = droppedBadge.attr('title');
				var badgeImage = droppedBadge.find('img').attr('src');
				var badgeId = droppedBadge.find('.badgeId').html(); 
				
				var badgePosition = 'badge_' + index;
				
				// if a badge already exists, I remove it
				$.each($( '#currentBadges_content').find('.badgeId'), function(){
					if ($(this).html() == badgeId) $(this).parent().remove();
				})
				
				
				// append a new badge
				$('#currentBadges_content').append(buildBadge_dropped(	index, 
																badgeId,
																badgeName,
																badgeDesc,
																badgeImage
															)
				);
				$('#buttonSave').addClass('active').removeAttr('disabled');
				$('#buttonCancel').addClass('active').removeAttr('disabled');
            }
	function onLinkedInLoad() {
		 IN.Event.on(IN, "auth", onLinkedInAuth);
	}
	function onLinkedInAuth() {
		//$('#possibleBadges_content').empty();
		$.getJSON(	"possiblebadges.php",
					function(data) {
									var $badges = $(); //empty jQuery object
									$.each(	data, 
											function(i, item){
												$badges = $badges.add(
																		buildBadge(	i, 
																					item.badge_id,
																					item.badge_name,
																					item.badge_desc,
																					item.badge_image
																						
																		)
												);
											}
									);	
									$("#possibleBadges_content").append($badges);
					}
		);
		$.getJSON(	"userbadges.php?linkedin_id="+$.urlParam('linkedin-id'),
					function(data) {
									var $badges = $(); //empty jQuery object
									$.each(	data, 
											function(i, item){
												$badges = $badges.add(
																		buildBadge_dropped(	i, 
																					item.badge_id,
																					item.badge_name,
																					item.badge_desc,
																					item.badge_image
																						
																		)
												);
											}
									);	
									if($badges.length > 0) $('#currentBadges_placeholder').hide();
									$("#currentBadges_content").prepend($badges);
									
									
									
					}
		);		
		
		//Adding droppable area
		$( "#currentBadges" ).droppable({
            activeClass: "ui-state-default",
            hoverClass: "ui-state-hover",
            accept: ":not(.ui-sortable-helper)",
            drop: function (event, badge) {onDrop((badge))}
		});
		
	};
