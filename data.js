const TypologyConverter = {
    // MBTI: 後ろに -A や -T などがついていても、JとPを入れ替える
    mbti: (val) => {
        if(!val) return '';
        // 文字列の中で「一番うしろにある J か P」を探して反転し、その後の文字はそのまま残す！
        return val.replace(/([JPjp])([^JPjp]*)$/, (match, p1, p2) => {
            const isLower = p1 === p1.toLowerCase();
            const flipped = p1.toUpperCase() === 'J' ? 'P' : 'J';
            // 元の文字が小文字なら小文字で、大文字なら大文字で返す
            return (isLower ? flipped.toLowerCase() : flipped) + p2;
        });
    },

    // エニアグラム: ウィングを入れ替える (例: 5w6 -> 5w4)
    enneagram: (val) => {
        if(!val) return '';
        const match = val.match(/^(\d)\s*w\s*(\d)(.*)$/i);
        if(match) {
            const core = parseInt(match[1]);
            const wing = parseInt(match[2]);
            const rest = match[3]; // うしろに何かついていたら残す
            let newWing = (core - 1) === wing || (core === 1 && wing === 9) ? (core + 1) : (core - 1);
            if (newWing === 10) newWing = 1;
            if (newWing === 0) newWing = 9;
            return `${core}w${newWing}${rest}`;
        }
        return val;
    },

    // ソシオニクス: LII-Ne などのサブタイプがついていても変換する！
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
        // 最初の3文字だけを抜き出して変換し、残りはそのままくっつける
        return val.replace(/^([a-zA-Z]{3})(.*)$/, (match, p1, p2) => {
            const up = p1.toUpperCase();
            if (map[up]) {
                // 大文字小文字の見た目を元のままに寄せつつ変換
                const isLower = p1 === p1.toLowerCase();
                const flipped = map[up];
                return (isLower ? flipped.toLowerCase() : flipped) + p2;
            }
            return match;
        });
    },

    // トライタイプ: 2文字目と3文字目をずらす (例: 513 -> 594)
    tritype: (val) => {
        if(!val) return '';
        const shiftMap = {'1':'9', '2':'3', '3':'4', '4':'5', '5':'6', '6':'7', '7':'8', '8':'9', '9':'1'};
        let cleanVal = val.replace(/[^0-9]/g, '');
        if(cleanVal.length >= 3) {
            let res = cleanVal[0] + shiftMap[cleanVal[1]] + shiftMap[cleanVal[2]];
            // 3文字の数字部分だけを置き換える（△などの記号は残る）
            return val.replace(cleanVal.substring(0,3), res);
        }
        return val;
    },

    // 生得本能: メイン本能をシフトする (例: sp/so -> sx/so)
    instinct: (val) => {
        if(!val) return '';
        const firstShift = {'sp':'sx', 'sx':'so', 'so':'sp'};
        return val.replace(/^(sp|sx|so)/i, (match) => {
            const lower = match.toLowerCase();
            return firstShift[lower] || match;
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
        // 最初の4文字のうち、3文字目と4文字目を入れ替えて、5文字目以降はそのままくっつける
        if(c.length >= 4) {
            return c.substring(0,2) + c[3] + c[2] + c.substring(4);
        }
        return val;
    },

    // アマトリカ: 3文字目と4文字目を入れ替え (例: PSEA -> PSAE)
    amatorica: (val) => {
        if(!val) return '';
        let c = val.trim();
        if(c.length >= 4) {
            return c.substring(0,2) + c[3] + c[2] + c.substring(4);
        }
        return val;
    }
};
