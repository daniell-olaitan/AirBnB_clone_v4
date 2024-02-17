function searchPlaces(data = {}) {
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    dataType: 'json',
    success: places => {
      $('section.places').html('');
      for (const place of places) {
        $('<article>' +
          '<div class="title_box">' +
          `<h2>${place.name}</h2>` +
          `<div class="price_by_night">$${place.price_by_night}</div>` +
          '</div>' +
          '<div class="information">' +
          `<div class="max_guest">${place.max_guest} Guest${place.max_guest != 1 ? 's' : ''}</div>` +
          `<div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms != 1 ? 's' : ''}</div>` +
          `<div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms != 1 ? 's' : ''}</div>` +
          '</div>' +
          '<div class="description">' +
          place.description +
          '</div>' +
          '<div class="reviews">' +
          `<h2>Reviews <span data-id="${place.id}">show</span></h2>` +
          '</div>' +
          '</article>').appendTo($('section.places'));
      }

      $('.reviews span').click(function () {
        const id = $(this).data('id');
        let place;

        console.log(places);
        for (const p in places) {
          if (id === p.id) {
            place = p;
          }
        }

        if ($(this).text() === 'show') {
          let reviewDOM = $('<ul></ul>');

          for (const review of place.reviews) {
            reviewDOM.append(`<li>${review.text}</li>`);
          }

          $('.reviews').append(reviewDOM);
          $(this).text('hide');
        } else {
          $('.reviews > ul').remove();
          $(this).text('show');
        }
      });
    }
  });
}

function checkboxChangeHandler(items, obj) {
  const id = $(obj).data('id');
  const name = $(obj).data('name');
  let selectedItems = '';

  if ($(obj).is(':checked')) {
    items[id] = name;
  } else {
    delete items[id];
  }

  Object.values(items).forEach(item => {
    selectedItems = selectedItems
      ? selectedItems + `, ${item}`
      : item;
  });

  return selectedItems;
}

$(function () {
  const statusUrl = 'http://0.0.0.0:5001/api/v1/status/';
  let amenities = {};
  let states = {};
  let cities = {};
  let selectedStates = '';
  let selectedCities = '';

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
    const selectedAmenities = checkboxChangeHandler(amenities, this);

    $('#selected-amenities').text(selectedAmenities);
  });

  $('.state').change(function () {
    selectedStates = checkboxChangeHandler(states, this);

    $('#selected-state-city').text(selectedStates
      ? selectedStates + `, ${selectedCities}`
      : selectedCities);
  });

  $('.city').change(function () {
    selectedCities = checkboxChangeHandler(cities, this);

    $('#selected-state-city').text(selectedStates
      ? selectedStates + `, ${selectedCities}`
      : selectedCities);
  });

  $('#search-btn').click(function () {
      searchPlaces({
        'amenities': Object.values(amenities),
        'states': Object.values(states),
        'cities': Object.values(cities)});
  });
});
