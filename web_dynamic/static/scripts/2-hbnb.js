$(function () {
  const statusUrl = 'http://0.0.0.0:5001/api/v1/status/';
  let amenities = {};

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
});
