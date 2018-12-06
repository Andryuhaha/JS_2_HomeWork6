(function ($) {
	$(function () {
		function cartDrop() {
			$('.cart').droppable({
				over: function (ev, ui) {
					ui.draggable.addClass('item_over_cart');
				},
				out: function (ev, ui) {
					ui.draggable.removeClass('item_over_cart');
				},
				hoverClass: 'overcart',
				drop: function (ev, ui) {
					totalSum = parseInt($('.total_sum').text(), 10);
					itemSum = parseInt(ui.draggable.find('.item_cost').text(), 10);
					totalItems = parseInt($('.total_items').text(), 10);
					$('.total_items').text(totalItems + 1);
					$('.total_sum').text(itemSum + totalSum);
					ui.draggable.removeClass('item_over_cart');
				}
			})
		}

		function generateItems() {
			var carousel = $('<div \>').addClass('carousel');
			$('.carousel_block').append(carousel);

			for (i = 1; i <= 10; i++) {
				var item = $('<div \>').addClass('item');

				if (i > 3) {
					item.attr('visible', false).hide();
				} else {
					item.attr('visible', true);
				}

				item.html('<span>' + 'Лот №' + i + '</span>' + '<p>' + 'Цена: ' +
					'<span class="item_cost">' + i * 135 + '</span>' + '</p>');
				item.attr('id', 'item' + i);
				item.draggable({
					revert: true,
					start: function () {
						$('.cart').addClass('drag_to_cart');
					},
					stop: function () {
						$('.cart').removeClass('drag_to_cart');
					}
				});
				carousel.append(item);
			}
		}

		function carousel() {
			var arrow = $('<div \>').addClass('arrow');
			arrow.clone().attr('id', 'arrow_left').prependTo('.carousel_block');
			arrow.clone().attr('id', 'arrow_right').appendTo('.carousel_block');
			$('#arrow_right').on('click', function () {
				$('.carousel')
					.children(':first')
					.hide('drop')
					.appendTo('.carousel')
					.attr('visible', false);
				$('.carousel')
					.children('[visible=false]:first')
					.effect('slide', {
						direction: 'right'
					})
					.attr('visible', true);
			});
			$('#arrow_left').on('click', function () {
				$('.carousel')
					.children('[visible=true]:last')
					.hide('drop', {
						direction: 'right'
					})
					.attr('visible', false);
				$('.carousel')
					.children('[visible=false]:last')
					.prependTo('.carousel')
					.attr('visible', true)
					.show('slide');
			});
		}

		generateItems();
		cartDrop();
		carousel();

	});
})(jQuery);
