document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("typology-form");
    const generateBtn = document.getElementById("generate-btn");
    const resetBtn = document.getElementById("reset-btn");
    const downloadBtn = document.getElementById("download-btn");
    const shareBtn = document.getElementById("share-btn");
    
    const resultSection = document.getElementById("capture-area");
    const actionButtons = document.getElementById("action-buttons");

    const originalList = document.getElementById("original-list");
    const twinList = document.getElementById("twin-list");

    // Google Apps Script(GAS)のWebアプリURL（設定していれば稼働します）
    const GAS_URL = "https://script.google.com/macros/s/xxxx/exec"; 

    // 共有用テキストを保持する変数
    let generatedShareText = "";

    const fields = [
        { id: "mbti", name: "MBTI", converter: TypologyConverter.mbti },
        { id: "enneagram", name: "Enneagram", converter: TypologyConverter.enneagram },
        { id: "socionics", name: "Socionics", converter: TypologyConverter.socionics },
        { id: "tritype", name: "Tritype", converter: TypologyConverter.tritype },
        { id: "instinct", name: "Instinct", converter: TypologyConverter.instinct },
        { id: "dcnh", name: "DCNH", converter: TypologyConverter.dcnh },
        { id: "psychosophy", name: "Psychosophy", converter: TypologyConverter.psychosophy },
        { id: "amatorica", name: "Amatorica", converter: TypologyConverter.amatorica }
    ];

    generateBtn.addEventListener("click", () => {
        originalList.innerHTML = "";
        twinList.innerHTML = "";
        let hasInput = false;
        const gasData = {}; 
        const shareResults = []; // シェアテキスト用の配列

        fields.forEach(field => {
            const inputVal = document.getElementById(field.id).value.trim();
            if (inputVal) {
                hasInput = true;
                const twinVal = field.converter(inputVal);

                // GAS用データ
                gasData[field.id + "_org"] = inputVal;
                gasData[field.id + "_twin"] = twinVal;

                // シェア用テキストの行を生成
                shareResults.push(`・${field.name}: ${inputVal} ➔ ${twinVal}`);

                // Original側に追加
                const origLi = document.createElement("li");
                origLi.innerHTML = `<span>${field.name}</span> <span class="val">${inputVal}</span>`;
                originalList.appendChild(origLi);

                // Twin側に追加
                const twinLi = document.createElement("li");
                twinLi.innerHTML = `<span>${field.name}</span> <span class="val">${twinVal}</span>`;
                twinList.appendChild(twinLi);
            }
        });

        if (hasInput) {
            resultSection.classList.remove("hidden");
            actionButtons.classList.remove("hidden");
            
            // シェアテキストの動的組み立て
            const resultSummaryText = shareResults.join("\n");
            generatedShareText = `私の自認タイプと、鏡合わせの双子タイプを診断したよ！\n\n【Original ➔ Twin】\n${resultSummaryText}\n\n同じものに惹かれ、違う方法で答えを探す「Twin Mirror」をあなたも試してみて！\n#TwinMirror #準同一診断 #双子診断`;

            // スムーズスクロール
            setTimeout(() => {
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            // GASへバックグラウンド送信
            sendToGAS(gasData);

        } else {
            alert("最低1つ以上の項目を入力してください。");
        }
    });

    // GAS送信関数
    async function sendToGAS(data) {
        if (!GAS_URL || GAS_URL.includes("xxxx")) return;
        try {
            await fetch(GAS_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            console.log("診断結果をスプレッドシートに送信しました。");
        } catch (error) {
            console.warn("GAS送信中にエラーが発生しました:", error);
        }
    }

    // リセット処理
    resetBtn.addEventListener("click", () => {
        form.reset();
        resultSection.classList.add("hidden");
        actionButtons.classList.add("hidden");
        originalList.innerHTML = "";
        twinList.innerHTML = "";
        generatedShareText = ""; // 共有用テキストもリセット
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 画像として保存
    downloadBtn.addEventListener("click", () => {
        const currentScroll = window.scrollY;
        window.scrollTo(0, 0); 
        
        html2canvas(resultSection, {
            backgroundColor: "#0f0f0f",
            scale: 2, 
            logging: false
        }).then(canvas => {
            const link = document.createElement("a");
            link.download = "twin-mirror.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            window.scrollTo(0, currentScroll);
        });
    });

    // Web Share API によるナビゲーション共有
    shareBtn.addEventListener("click", async () => {
        const shareData = {
            title: "Twin Mirror - 準同一・双子タイプ診断",
            text: generatedShareText || "同じものに惹かれ、違う方法で答えを探す。鏡合わせの「双子（準同一）」タイプを診断しよう！\n#TwinMirror #準同一・双子タイプ診断",
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("シェアがキャンセルされました", err);
            }
        } else {
            alert("お使いのブラウザは共有機能に対応していません。URLをコピーしてシェアしてください！\n" + window.location.href);
        }
    });
});