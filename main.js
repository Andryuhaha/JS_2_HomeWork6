(function ($) {
	$(function () {
		var name = $('#name'),
			date = $('#date'),
			tel = $('#tel'),
			mail = $('#mail'),
			$cityInput = $('#city_input'),
			$divParent = $('#city_input_form'),
			message = $('#text'),
			nameRE = /^[a-zа-яё]{2,}$/i,
			dateRE = /^\d\d[.,]\d\d[.,]\d{4}$/,
			telRE = /\+\d{1,4}\(?\d{3}\)?\d{3}-?\d{4}\b/,
			emailRE = /(^\w+(|(.|-)\w+))(?=@[a-z]{2,}\.[a-z]{2,4}\b)/i,
			messageRE = /\w+|[а-яё]+[,.!?@:;]*/gi,
			$cityRE = /^[а-яё]+$/i;

		$('input[type="submit"]').on('click', function () {
			$('#fieldsetInput').append($('<div id="dialog" \>'));

			function dialog(element, text) {
				$('#dialog').append(element).dialog({
					width: '404px',
					buttons: {
						OK: function () {
							$(this).dialog('close');
							$('#dialog').remove();
						}
					},
					modal: true,
					title: text
				});
			}
			var i = 0;

			function classListToggle(re, data) {
				var test = re.test(data.val());
				if (test) {
					if (data === date) {
						var dateArray = date.val().split(/[,.]/),
							day = dateArray[0],
							month = dateArray[1],
							year = dateArray[2];
						if ((year >= 2010 || year < 1900) || (month > 12 || month < 0) ||
							(day > 31 || day < 0)) {
							date.effect("bounce", {
								times: 3
							}, "slow").parent().addClass('wrong_date');
							return;
						}
					}
					data.removeClass('false').parent().removeClass('wrong_date');
					i++;
					if (i === 6) {
						$('.contacts').addClass('data_transfer')
							.delay(1000)
							.queue(function () {
								$(this).removeClass('data_transfer');
								var successField = $('<div \>').html('Your message successfully send!');
								dialog(successField, 'Success!');
								$('.input_fields input').val('');
								$(this).dequeue();
							});
					}
				} else {
					data.addClass('false').effect("shake", {
						times: 3
					}, "slow");
					var errorField = $('<div />').html('Check out the "' + '<span>' +
						data.prev().text() + '</span>' + '" field');
					dialog(errorField, 'Error!');
				}
			}
			classListToggle(nameRE, name);
			classListToggle(telRE, tel);
			classListToggle(emailRE, mail);
			classListToggle(dateRE, date);
			classListToggle(messageRE, message);
			classListToggle($cityRE, $cityInput);
		});
		$cityInput.on('keyup', function () {
			if ($cityRE.test(this.value)) {
				$divParent.removeClass('wrong_input');
				$divParent.removeClass('wrong_city');
				$('#city_list').remove();
				if ($cityInput.val().length > 2) {
					var $citiesArr = [];
					$.ajax({
						url: 'http://api.spacenear.ru/index.php',
						type: 'POST',
						data: {
							pattern: this.value
						},
						dataType: 'json',
						success: function (cities) {
							if (cities) {
								$citiesArr = cities.map(function (value) {
									return value.name;
								});
							}
						},
						error: function () {
							console.log('error!');
						},
						xhr: function () {
							var xhr = $.ajaxSettings.xhr();
							xhr.upload.onprogress = function () {
								$('.loader').show();
							};
							return xhr;
						}
					}).done(function () {
						$('.loader').hide();

						if (!$('#city_list').length && $citiesArr.length > 0) {
							var $select = $('<select />').attr({
								id: 'city_list',
								size: function () {
									if ($citiesArr.length > 2) {
										return $citiesArr.length;
									}
									return 2;
								}
							}).hide();
							for (var i = 0; i < $citiesArr.length; i++) {
								var $option = $('<option />');
								$option.attr('value', $citiesArr[i]).text($citiesArr[i]).dblclick(function () {
									$cityInput.val(this.value);
									$(this).parent().slideUp(function () {
										$(this).remove();
									});
								});
								$select.append($option);
							}
							$divParent.append($select);
							$($select).slideDown();
						} else if ($citiesArr.length === 0) {
							$divParent.addClass('wrong_city');
							$('#city_list').slideUp(function () {
								$(this).remove();
							});
						}
					});
				}
			} else {
				$divParent.addClass('wrong_input');
				$('#city_list').slideUp(function () {
					$(this).remove();
				});
			}
		});
		$('input[type="reset"]').on('click', function () {
			$('.input_fields input').removeClass('false');
			date.parent().removeClass('wrong_date');
			$divParent.removeClass('wrong_input');
		});

		date.datepicker({
			firstDay: 1,
			dateFormat: 'dd.mm.yy',
			monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль",
                    "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
			dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
			maxDate: '-8y'
		});
	});
})(jQuery);
