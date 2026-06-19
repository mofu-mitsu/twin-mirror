// 準同一（双子）タイプを算出するためのロジックまとめ
const TypologyConverter = {
    // MBTI: JとPを入れ替える
    mbti: (val) => {
        if(!val) return '';
        return val.replace(/[JPjp]$/i, (match) => {
            return match.toUpperCase() === 'J' ? 'P' : 'J';
        });
    },

    // エニアグラム: ウィングを入れ替える (例: 5w6 -> 5w4)
    enneagram: (val) => {
        if(!val) return '';
        const match = val.match(/^(\d)w(\d)$/i);
        if(match) {
            const core = parseInt(match[1]);
            const wing = parseInt(match[2]);
            // 該当するもう一つのウィングを計算
            let newWing = (core - 1) === wing || (core === 1 && wing === 9) ? (core + 1) : (core - 1);
            if (newWing === 10) newWing = 1;
            if (newWing === 0) newWing = 9;
            return `${core}w${newWing}`;
        }
        return val;
    },

    // ソシオニクス: 準同一関係 (Quasi-Identical) に変換
    socionics: (val) => {
        if(!val) return '';
        const map = {
            'ILE':'LIE', 'LIE':'ILE',
            'SEI':'ESI', 'ESI':'SEI',
            'ESE':'SEE', 'SEE':'ESE',
            'LII':'ILI', 'ILI':'LII',
            'EIE':'IEE', 'IEE':'EIE',
            'LSI':'SLI', 'SLI':'LSI',
            'SLE':'LSE', 'LSE':'SLE',
            'IEI':'EII', 'EII':'IEI'
        };
        return map[val.toUpperCase()] || val; // 見つからなければそのまま返す
    },

    // トライタイプ: 2文字目と3文字目をずらす (例: 513 -> 594)
    tritype: (val) => {
        if(!val) return '';
        // 1->9, 2->3, 3->4, 4->5... のようにシフト
        const shiftMap = {'1':'9', '2':'3', '3':'4', '4':'5', '5':'6', '6':'7', '7':'8', '8':'9', '9':'1'};
        let cleanVal = val.replace(/[^0-9]/g, '');
        if(cleanVal.length === 3) {
            let res = cleanVal[0] + shiftMap[cleanVal[1]] + shiftMap[cleanVal[2]];
            return val.replace(cleanVal, res); // "△"などの記号を保持
        }
        return val;
    },

    // 生得本能: メイン本能をシフトする (例: sp/so -> sx/so)
    instinct: (val) => {
        if(!val) return '';
        const firstShift = {'sp':'sx', 'sx':'so', 'so':'sp'};
        return val.replace(/^(sp|sx|so)/i, (match) => {
            return firstShift[match.toLowerCase()] || match;
        });
    },

    // DCNH: D↔C, N↔H (例: NC -> HD)
    dcnh: (val) => {
        if(!val) return '';
        const map = {'D':'C', 'C':'D', 'N':'H', 'H':'N', 'd':'c', 'c':'d', 'n':'h', 'h':'n'};
        return val.split('').map(c => map[c] || c).join('');
    },

    // サイコソフィア: 3文字目と4文字目を入れ替え (例: LVFE -> LVEF)
    psychosophy: (val) => {
        if(!val) return '';
        let c = val.trim();
        if(c.length === 4) {
            return c.substring(0,2) + c[3] + c[2];
        }
        return val;
    },

    // アマトリカ: 3文字目と4文字目を入れ替え (例: PSEA -> PSAE)
    amatorica: (val) => {
        if(!val) return '';
        let c = val.trim();
        if(c.length === 4) {
            return c.substring(0,2) + c[3] + c[2];
        }
        return val;
    }
};