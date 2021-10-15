window.addEventListener('load', () => {

  // 動態產生breed選項
  const selectBreed = document.querySelector('#selectBreed')
  axios
    .get('https://dog.ceo/api/breeds/list/all')
    .then(response => {
      // 把品種名稱轉為陣列，以便後續處理
      let breeds = Object.entries(response.data.message)
      let option = `
        <option value="" selected>請選擇品種</option>
      `
      breeds.forEach(breed => {
        if (breed[1].length > 0) {  // 若有副品種，逐一列出
          breed[1].forEach(sub_breed => {
            option += `
            <option value="${sub_breed} ${breed[0]}" >${sub_breed} ${breed[0]}</option>
            `
          })
        } else {
          option += `
            <option value="${breed[0]}" >${breed[0]}</option>
          `
        }
      })
      selectBreed.innerHTML = option
    })
    .catch(error => console.log(error))


  // 依選項發送 request，並將圖片顯示於網頁
  const button = document.querySelector('button')
  const show = document.querySelector('#show')

  button.addEventListener('click', function () {
    let optionValue = selectBreed.value
    if (optionValue !== "") {
      let URL = `https://dog.ceo/api/breed/${optionValue}/images`
      axios
        .get(URL)
        .then(response => {
          let breedImg = response.data.message
          let showImg = `<div class="card-columns">`
          breedImg.forEach(img => {
            showImg += `
          <div class="card border-0">
            <img data-src="${img}" class="card-img-top lazyload" alt="...">
          </div>
          `
          })
          showImg += `</div>`
          show.innerHTML = showImg

          // 透過 Intersection Observer API 實作 Lazy Loading
          const watcher = new IntersectionObserver(onEnterView)
          const lazyImages = document.querySelectorAll('.lazyload')

          for (let image of lazyImages) {
            watcher.observe(image) // 開始監視
          }

          function onEnterView(entries, observer) {
            for (let entry of entries) {
              if (entry.isIntersecting) {
                // 監視目標進入畫面
                const img = entry.target
                img.setAttribute('src', img.dataset.src) // 把值塞回 src
                img.removeAttribute('data-src')
                observer.unobserve(img) // 取消監視
              }
            }
          }
        })
        .catch(error => console.log(error))
    }
  })
})
