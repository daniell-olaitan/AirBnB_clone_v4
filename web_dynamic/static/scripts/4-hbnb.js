function searchPlaces(data = {}) {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    dataType: 'json',
    success: body => {
      $('section.places').html('');
      for (const place of body) {
        $('<article>' +
          '<div class="title_box">' +
          `<h2>${place.name}</h2>` +
          `<div class="price_by_night">${place.price_by_night}</div>` +
          '</div>' +
          '<div class="information">' +
          `<div class="max_guest">${place.max_guest} Guest${place.max_guest != 1 ? 's' : ''}</div>` +
          `<div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms != 1 ? 's' : ''}</div>` +
          `<div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? 's' : ''}</div>` +
          '</div>' +
          '<div class="description">' +
          place.description +
          '</div>' +
          '</article>').appendTo($('section.places'));
      }
    }
  });
}

$(function () {
  const statusUrl = 'http://0.0.0.0:5001/api/v1/status/';
  let amenities = {};

  searchPlaces();

  $.get(statusUrl, body => {
    const statusElement = $('div#api-status');

    if (body.status === 'OK') {
      statusElement.addClass('available');
    } else {
      statusElement.removeClass('available');
    }
  });

  $('.amenity').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');
    let selectedAmenities = '';

    if ($(this).is(':checked')) {
      amenities[amenityId] = amenityName;
    } else {
      delete amenities[amenityId];
    }

    Object.values(amenities).forEach(amenity => {
      selectedAmenities = selectedAmenities
        ? selectedAmenities + `, ${amenity}`
        : amenity;
    });

    $('#selected-amenities').text(selectedAmenities);
  });

  $('#search-btn').click(function () {
      searchPlaces({ 'amenities': Object.values(amenities) });
  });

});
