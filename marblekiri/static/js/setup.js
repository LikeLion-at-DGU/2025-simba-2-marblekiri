document.addEventListener("DOMContentLoaded", function () {
  const containers = document.querySelectorAll(".theme-category-container");
  const body = document.body;
  const themes = ["college", "sports", "idol", "custom"];
  const selectedTheme = document.getElementById("selected-theme");
  const gameForm = document.getElementById("gameForm");

  // 테마 관련 클래스 제거
  function clearTheme() {
    themes.forEach((t) => {
      body.classList.remove(`hover-${t}`, `selected-${t}`);
    });
  }

  //테마 hover / click 이벤트 등록
  containers.forEach((el) => {
    const theme = el.dataset.value;

    // 호버 시
    el.addEventListener("mouseenter", () => {
      if (!el.classList.contains("selected")) {
        clearTheme();
        body.classList.add(`hover-${theme}`);
      }
    });

    // 커서 이동 시
    el.addEventListener("mouseleave", () => {
      clearTheme();
      const selected = document.querySelector(
        ".theme-category-container.selected"
      );
      if (selected) {
        body.classList.add(`selected-${selected.dataset.value}`);
      }
    });

    // 마우스 클릭 시
    el.addEventListener("click", () => {
      containers.forEach((e) => e.classList.remove("selected"));
      el.classList.add("selected");

      selectedTheme.value = theme; // 선택한 테마 저장
      clearTheme();
      body.classList.add(`selected-${theme}`);

      console.log("선택한 테마:", theme);
    });
  });

  // 게임 설정 form 제출 처리
  gameForm.addEventListener("submit", function (event) {
    const unlimitedRadio = document.getElementById("unlimited");
    const slider = document.getElementById("turn-slider");
    const theme = selectedTheme.value;

    // max_turns 값 name 제거 or 유지
    if (unlimitedRadio.checked) {
      slider.removeAttribute("name");
      console.log("무제한 턴 → max_turns 안 보냄"); // max_turns 전송 안 되게
    } else {
      slider.setAttribute("name", "max_turns");
      console.log("지정 턴 수 → max_turns =", slider.value); // 제한 모드일 땐 name 유지
    }

    // 테마 미선택 시 제출 막기
    if (!theme) {
      alert("테마를 선택해주세요!");
      event.preventDefault();
      return;
    }

    // 커스텀 테마일 경우 페이지 이동
    if (theme == "custom") {
      event.preventDefault();

      if (unlimitedRadio.checked) {
        slider.removeAttribute("name");  // 이걸 안 하면 value가 같이 전송됨
      } else {
        slider.setAttribute("name", "max_turns");
      }

      // 폼 제출 위치 변경해서 전송
      gameForm.action = "/custom_questions/";
      gameForm.method = "POST";
      gameForm.submit();
    }
  });
});

// 슬라이더 및 턴 수 토글
document.addEventListener("DOMContentLoaded", function () {
  const unlimitedRadio = document.getElementById("unlimited");
  const limitedRadio = document.getElementById("limited");
  const sliderContainer = document.getElementById("slider-container");
  const slider = document.getElementById("turn-slider");
  const turnCount = document.getElementById("turn-count");

  // 슬라이더는 항상 보이지만 기본은 비활성화
  slider.disabled = true; // 회색, 비활성화 상태로 시작
  sliderContainer.style.opacity = "0.5";

  unlimitedRadio.addEventListener("change", () => {
    if (unlimitedRadio.checked) {
      slider.disabled = true;
      sliderContainer.style.opacity = "0.5";
    }
  });

  limitedRadio.addEventListener("change", () => {
    if (limitedRadio.checked) {
      slider.disabled = false;
      sliderContainer.style.opacity = "1";
    }
  });

  slider.addEventListener("input", () => {
    turnCount.textContent = slider.value;
  });
});

// 인원 추가/삭제 로직
function addPlayer() {
  const list = document.getElementById("player-list");
  const count = list.children.length + 1;
  console.log("add/현재 인원 수:", list.children.length);

  // 최대 10명까지만 추가 가능하도록!
  if (list.children.length > 9) {
    alert("최대 10명의 플레이어까지 가능합니다!");
  } else {
    const div = document.createElement("div");
    div.className = "player-entry";
    div.innerHTML = `
        <span class="player-number">${count}.</span>
        <input type="text" name="players[]" placeholder="이름 입력" required />
        <button type="button" class="remove-btn" onclick="removePlayer(this)">-</button>
      `;
    list.appendChild(div);
  }
}

function removePlayer(button) {
  const list = document.getElementById("player-list");
  console.log("현재 인원 수:", list.children.length);

  // 최소 1명 이상일 때만 삭제 가능하도록!
  if (list.children.length > 1) {
    button.parentElement.remove();
    Array.from(list.children).forEach((entry, index) => {
      entry.querySelector(".player-number").textContent = `${index + 1}.`;
    });
  } else {
    alert("최소 1명의 플레이어는 필요합니다!");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const gameStartBtn = document.querySelector(".game-start-btn");
  const playerList = document.getElementById("player-list");
  const selectedThemeInput = document.getElementById("selected-theme");

  // 버튼 활성화 조건 체크 함수
  function checkGameStartEnable() {
    const themeSelected = selectedThemeInput.value !== "";
    const players = playerList.querySelectorAll("input[name='players[]']");
    const hasValidPlayer = Array.from(players).some(
      (p) => p.value.trim() !== ""
    );

    if (themeSelected && hasValidPlayer) {
      gameStartBtn.classList.add("active");
    } else {
      gameStartBtn.classList.remove("active");
    }
  }

  // 테마 클릭 시
  const themeButtons = document.querySelectorAll(".theme-category-container");
  themeButtons.forEach((btn) => {
    btn.addEventListener("click", checkGameStartEnable);
  });

  // 플레이어 이름 입력 시
  playerList.addEventListener("input", checkGameStartEnable);

  // 인원 추가 버튼 클릭 시 (새 input 생기므로 체크 재실행 필요)
  document.querySelector(".add-btn").addEventListener("click", () => {
    setTimeout(checkGameStartEnable, 0); // DOM 업데이트 후 실행
  });
});
