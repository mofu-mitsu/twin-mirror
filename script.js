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

    const GAS_URL = "https://script.google.com/macros/s/AKfycbwwd8mCtdS-a3HkoZS_4O57-Tmq-MGG3MIigw2chMVr7Mxzdvw-4GlM74kW6iYpzxGG/exec"; 

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
        const shareResults = []; 

        fields.forEach(field => {
            const inputVal = document.getElementById(field.id).value.trim();
            if (inputVal) {
                hasInput = true;
                const twinVal = field.converter(inputVal);

                gasData[field.id + "_org"] = inputVal;
                gasData[field.id + "_twin"] = twinVal;
                shareResults.push(`・${field.name}: ${inputVal} ➔ ${twinVal}`);

                const origLi = document.createElement("li");
                origLi.innerHTML = `<span>${field.name}</span> <span class="val">${inputVal}</span>`;
                originalList.appendChild(origLi);

                const twinLi = document.createElement("li");
                twinLi.innerHTML = `<span>${field.name}</span> <span class="val">${twinVal}</span>`;
                twinList.appendChild(twinLi);
            }
        });

        if (hasInput) {
            resultSection.classList.remove("hidden");
            actionButtons.classList.remove("hidden");
            
            const resultSummaryText = shareResults.join("\n");
            // ハッシュタグを2つに変更！
            generatedShareText = `私の自認タイプと、鏡合わせの双子タイプを診断したよ！\n\n【Original ➔ Twin】\n${resultSummaryText}\n\n同じものに惹かれ、違う方法で答えを探す「Twin Mirror」をあなたも試してみて！\n#TwinMirror #準同一・双子診断`;

            setTimeout(() => {
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);

            sendToGAS(gasData);
        } else {
            alert("最低1つ以上の項目を入力してください。");
        }
    });

    async function sendToGAS(data) {
        if (!GAS_URL || GAS_URL.includes("xxxx")) return;
        try {
            await fetch(GAS_URL, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            console.log("診断結果をスプレッドシートに送信しました。");
        } catch (error) {
            console.warn("GAS送信中にエラーが発生しました:", error);
        }
    }

    resetBtn.addEventListener("click", () => {
        form.reset();
        resultSection.classList.add("hidden");
        actionButtons.classList.add("hidden");
        originalList.innerHTML = "";
        twinList.innerHTML = "";
        generatedShareText = ""; 
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ============================================
    // 画像保存（スマホでも横長PCレイアウトで保存）
    // ============================================
    downloadBtn.addEventListener("click", () => {
        const currentScroll = window.scrollY;
        window.scrollTo(0, 0); 
        
        html2canvas(resultSection, {
            backgroundColor: "#0f0f0f",
            scale: 2, 
            logging: false,
            windowWidth: 800, // キャプチャ用の仮想ウィンドウ幅をPCサイズに固定
            onclone: (clonedDoc) => {
                // キャプチャ用のDOMだけ強制的にPC用のレイアウトに書き換える
                const clonedResult = clonedDoc.getElementById("capture-area");
                const mirrorContainer = clonedDoc.querySelector(".mirror-container");
                const divider = clonedDoc.querySelector(".mirror-divider");

                clonedResult.style.width = "800px";
                clonedResult.style.padding = "2.5rem 2rem";
                
                if (mirrorContainer) {
                    mirrorContainer.style.flexDirection = "row"; // 強制横並び
                    mirrorContainer.style.alignItems = "stretch";
                }
                
                if (divider) {
                    divider.style.transform = "none"; // 矢印の回転を元に戻す
                    divider.style.padding = "0 1.5rem";
                }
            }
        }).then(canvas => {
            const link = document.createElement("a");
            link.download = "twin-mirror.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
            window.scrollTo(0, currentScroll);
        });
    });

    shareBtn.addEventListener("click", async () => {
        const shareData = {
            title: "Twin Mirror - 準同一・双子タイプ診断",
            text: generatedShareText || "同じものに惹かれ、違う方法で答えを探す。鏡合わせの「双子（準同一）」タイプを診断しよう！\n#TwinMirror #準同一・双子診断",
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
