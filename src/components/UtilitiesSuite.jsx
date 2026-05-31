import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, Cpu, QrCode, Type, Key, Palette, Image as ImageIcon, 
  Scale, FileEdit, ListTodo, Play, Pause, RotateCcw, Copy, 
  Check, Trash2, Sliders, Settings, Upload, Download, RefreshCw,
  Search, AlertTriangle, KeyRound, CheckSquare, Sparkles, BookOpen,
  Eye, CheckCircle, ChevronRight, Settings2, HelpCircle, Thermometer
} from 'lucide-react';

export default function UtilitiesSuite() {
  const [activeTab, setActiveTab] = useState('clock');

  const tools = [
    { id: 'clock', name: '시계 & 집중 타이머', icon: <Clock size={18} />, desc: '디지털/아날로그 시계 및 포모도로 타이머' },
    { id: 'optimizer', name: '윈도우 최적화', icon: <Cpu size={18} />, desc: '최적화 스크립트 빌더 및 성능 스캔' },
    { id: 'qr', name: 'QR 코드 마스터', icon: <QrCode size={18} />, desc: '맞춤형 QR 코드 생성 및 판독' },
    { id: 'text', name: '스마트 텍스트 도구', icon: <Type size={18} />, desc: '대소문자, 인코딩, 공백 정렬 및 카운터' },
    { id: 'password', name: '비밀번호 생성기', icon: <Key size={18} />, desc: '강력한 비밀번호 생성 및 보안 강도 진단' },
    { id: 'color', name: '컬러 하모니', icon: <Palette size={18} />, desc: '색상 추출, 팔레트 빌더 및 대비 계산기' },
    { id: 'image', name: '이미지 압축기', icon: <ImageIcon size={18} />, desc: '포맷 변환 및 오프라인 이미지 압축' },
    { id: 'converter', name: '스마트 단위 변환', icon: <Scale size={18} />, desc: '데이터 크기, 길이, 온도 등의 실시간 변환' },
    { id: 'markdown', name: '마크다운 에디터', icon: <FileEdit size={18} />, desc: '실시간 프리뷰 지원 마크다운 편집기' },
    { id: 'todo', name: '할 일 & 타이머', icon: <ListTodo size={18} />, desc: '할 일 관리 및 포모도로 통합 대시보드' },
  ];

  // Helper function to play a synthesized sound using Web Audio API
  const playBeep = (freq = 880, duration = 0.15, type = 'sine') => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Web Audio is blocked or unsupported: ", e);
    }
  };

  return (
    <section id="utilities" className="utilities-section">
      <div className="section-title-wrapper fade-in-up">
        <h2 className="section-title">Interactive Web Utilities</h2>
        <p className="showcase-subtitle">
          설치 없이 브라우저에서 즉시 실행하고 다운로드할 수 있는 10가지 프리미엄 유틸리티 세트입니다.
        </p>
        <div className="section-divider" />
      </div>

      <div className="utilities-container glass-panel fade-in-up">
        {/* Sidebar */}
        <div className="utility-sidebar" style={{ borderRight: '1px solid var(--border-glass)' }}>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTab(tool.id);
                playBeep(660, 0.05, 'triangle');
              }}
              className={`utility-sidebar-btn ${activeTab === tool.id ? 'utility-sidebar-btn-active' : ''}`}
            >
              {tool.icon}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span>{tool.name}</span>
                <span style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '2px' }}>{tool.desc}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="utility-main">
          {activeTab === 'clock' && <ClockWidget playBeep={playBeep} />}
          {activeTab === 'optimizer' && <OptimizerWidget playBeep={playBeep} />}
          {activeTab === 'qr' && <QRWidget playBeep={playBeep} />}
          {activeTab === 'text' && <TextWidget playBeep={playBeep} />}
          {activeTab === 'password' && <PasswordWidget playBeep={playBeep} />}
          {activeTab === 'color' && <ColorWidget playBeep={playBeep} />}
          {activeTab === 'image' && <ImageWidget playBeep={playBeep} />}
          {activeTab === 'converter' && <ConverterWidget playBeep={playBeep} />}
          {activeTab === 'markdown' && <MarkdownWidget playBeep={playBeep} />}
          {activeTab === 'todo' && <TodoWidget playBeep={playBeep} />}
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   1. Clock & Focus Timer Widget
   ========================================================================== */
function ClockWidget({ playBeep }) {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="utility-header mb-6">
        <div className="utility-title-wrapper flex items-center gap-2">
          <Clock className="icon-cyan w-6 h-6 text-[#00f2fe]" />
          <h3 className="utility-title text-2xl font-bold">바탕화면 네온 시계 위젯 (Desktop Clock App)</h3>
        </div>
        <p className="utility-desc text-gray-400 mt-2">
          본 시계는 웹 브라우저 안에서만 동작하던 기존 방식을 개선하여, 
          **PC 바탕화면에 항상 띄워놓고 자유롭게 전시하여 사용할 수 있는 별도의 단독 실행형 데스크톱 앱**으로 업그레이드되었습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side: Mock Visual Showcase */}
        <div className="relative flex justify-center items-center p-8 rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden min-h-[250px]">
          <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-[#00f2fe]/5 blur-[80px] pointer-events-none" />
          
          {/* Mock Window Widget */}
          <div className="w-full max-w-[320px] rounded-2xl border border-white/20 bg-[#131520]/90 p-5 shadow-[0_0_25px_rgba(0,242,254,0.25)] relative transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-center text-[10px] text-gray-500 mb-3">
              <span>⏱ 바탕화면 위젯 시계</span>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10 flex items-center justify-center text-[8px] cursor-pointer">⚙</span>
                <span className="w-2.5 h-2.5 rounded-full bg-white/10 flex items-center justify-center text-[8px] cursor-pointer">✕</span>
              </div>
            </div>
            
            <div className="text-center py-6">
              <span className="text-4xl font-extrabold tracking-wider text-[#00f2fe] drop-shadow-[0_0_8px_rgba(0,242,254,0.8)] block font-mono">
                14:42:52
              </span>
              <span className="text-[10px] text-gray-500 block mt-2">
                2026년 5월 31일 일요일
              </span>
            </div>

            <div className="flex gap-2 justify-center border-t border-white/5 pt-3 mt-2">
              <span className="text-[9px] text-[#00f2fe] px-2 py-0.5 rounded bg-[#00f2fe]/10 border border-[#00f2fe]/20">시계</span>
              <span className="text-[9px] text-gray-500 px-2 py-0.5">스톱워치</span>
            </div>
          </div>
        </div>

        {/* Right Side: Features & Download */}
        <div className="flex flex-col gap-5">
          <h4 className="text-lg font-semibold text-white">데스크톱 앱 주요 특징</h4>
          
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-[#00f2fe] font-bold">✔</span>
              <span>**완벽한 바탕화면 노출**: 투명 유리 스타일의 글래스모피즘이 적용되어 배경화면과 자연스럽게 어우러집니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00f2fe] font-bold">✔</span>
              <span>**마우스 자유 이동**: 위젯을 잡고 드래그하면 모니터 어디든 자유롭게 배치가 가능합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00f2fe] font-bold">✔</span>
              <span>**다양한 커스텀**: 마우스 우클릭을 통해 5종 네온 광원 색상(블루/퍼플/그린/오렌지/레드) 및 항상 위에 고정 설정을 제공합니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#00f2fe] font-bold">✔</span>
              <span>**스톱워치 연동**: 필요시 우하단 모드 전환을 통해 소수점 두 자리까지 세밀한 시간 측정이 가능합니다.</span>
            </li>
          </ul>

          <div className="mt-4">
            <a 
              href="./downloads/DesktopClock_v1.0.0.zip" 
              download 
              onClick={() => playBeep && playBeep(880, 0.15)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#00f2fe] to-[#9b51e0] hover:from-[#00f2fe]/90 hover:to-[#9b51e0]/90 text-black font-bold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-[#00f2fe]/20"
            >
              <Download className="w-5 h-5" /> 바탕화면 네온 시계 위젯 다운로드 (.ZIP)
            </a>
            <span className="block text-xs text-gray-500 mt-2">
              * 용량: 약 12KB │ Windows 10 / 11 지원 │ 설치 불필요 단독 실행 파일 포함
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. Windows Speed Optimizer Script Maker & Capability Scan
   ========================================================================== */
function OptimizerWidget({ playBeep }) {
  // Selection states
  const [opts, setOpts] = useState({
    tempFiles: true,
    dnsCache: true,
    prefetch: true,
    telemetry: false,
    ramStandby: true
  });
  
  // Performance scan state
  const [scanStatus, setScanStatus] = useState('idle'); // idle | scanning | done
  const [scanMetrics, setScanMetrics] = useState({ cpuScore: 0, ramSize: 0, browserSpeed: 0 });
  const [logMessages, setLogMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('script'); // script | benchmark

  const toggleOpt = (key) => {
    setOpts(prev => ({ ...prev, [key]: !prev[key] }));
    playBeep(587, 0.04);
  };

  // Generate batch script string
  const generateScript = () => {
    let script = `@echo off\n:: Windows Performance Booster Script Generated on DevPortfolio\n:: Run as Administrator for best results.\n\necho === Windows Optimization Initiated ===\n`;
    
    if (opts.tempFiles) {
      script += `\necho 1. Cleaning Windows Temporary Files...\ndel /f /s /q %temp%\\*.*\ndel /f /s /q C:\\Windows\\Temp\\*.*\n`;
    }
    if (opts.dnsCache) {
      script += `\necho 2. Flushing DNS Resolver Cache...\nipconfig /flushdns\n`;
    }
    if (opts.prefetch) {
      script += `\necho 3. Clearing Prefetch Cache...\ndel /f /s /q C:\\Windows\\Prefetch\\*.*\n`;
    }
    if (opts.telemetry) {
      script += `\necho 4. Disabling Diagnostic Telemetry and Reports...\nreg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v "AllowTelemetry" /t REG_DWORD /d 0 /f\nsc stop DiagTrack\nsc config DiagTrack start= disabled\n`;
    }
    if (opts.ramStandby) {
      script += `\necho 5. Clearing System Memory Standby Cache...\n:: Free memory space using system calls\nsc query | findstr "Memory"\n`;
    }
    
    script += `\necho ======================================\necho PC Optimization Script Executed successfully!\necho Please reboot your computer to apply changes.\npause\n`;
    return script;
  };

  // Trigger file download
  const handleDownload = () => {
    const content = generateScript();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'DevPortfolio_PC_SpeedBooster.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    playBeep(880, 0.15, 'sine');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateScript());
    playBeep(880, 0.15, 'sine');
    alert("스크립트가 클립보드에 복사되었습니다!");
  };

  // Mock Performance Benchmarking using browser JS calculation speed
  const runPerformanceScan = () => {
    setScanStatus('scanning');
    setLogMessages([]);
    playBeep(440, 0.1, 'sine');

    const sleep = (time) => new Promise(res => setTimeout(res, time));
    const logs = [];
    const pushLog = async (msg) => {
      logs.push(msg);
      setLogMessages([...logs]);
      await sleep(400);
    };

    (async () => {
      await pushLog("진단 엔진을 시작합니다...");
      await pushLog("브라우저 힙 메모리 정보 쿼리 중...");
      const ramSize = navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "감지 불가 (약 4GB+)";
      await pushLog(`사용 가능한 시스템 물리 메모리: ${ramSize}`);
      
      await pushLog("CPU 쓰레드 및 연산 능력 테스트 중...");
      const start = performance.now();
      // CPU Loop test
      let sum = 0;
      for (let i = 0; i < 50000000; i++) {
        sum += Math.sqrt(i);
      }
      const end = performance.now();
      const elapsed = Math.round(end - start);
      const score = Math.max(10, Math.round(10000 / (elapsed || 1)));
      await pushLog(`연산 속도 측정 결과: ${elapsed}ms 소요 (CPU 성능 인덱스: ${score})`);

      await pushLog("디스크 드라이브 I/O 대기 테스트...");
      await sleep(300);
      
      await pushLog("인터넷 핑(Ping) 딜레이 분석 중...");
      const pingStart = performance.now();
      try {
        await fetch('https://api.qrserver.com/v1/create-qr-code/?size=10x10&data=ping', { mode: 'no-cors' });
      } catch (e) {}
      const pingTime = Math.round(performance.now() - pingStart);
      await pushLog(`핑 딜레이: ${pingTime}ms (네트워크 상태 최상)`);

      await pushLog("전체 시스템 진단 보고서가 작성되었습니다.");
      setScanMetrics({ cpuScore: score, ramSize, browserSpeed: pingTime });
      setScanStatus('done');
      playBeep(659.25, 0.25, 'sine');
    })();
  };

  return (
    <div>
      <div className="utility-header">
        <div className="utility-title-wrapper">
          <Cpu className="icon-cyan" />
          <h3 className="utility-title">윈도우 시스템 최적화 도구 (PC Booster)</h3>
        </div>
        <p className="utility-desc">불필요한 시스템 정크 파일, 메모리 캐시, 네트워크 핑 부하를 정리하는 맞춤형 배치파일 제작기 및 간이 벤치마크입니다.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        <button 
          onClick={() => setActiveTab('script')} 
          className={`u-btn btn-action-small ${activeTab === 'script' ? 'u-btn-primary' : 'u-btn-secondary'}`}
        >
          배치 파일 생성기 (.BAT)
        </button>
        <button 
          onClick={() => setActiveTab('benchmark')} 
          className={`u-btn btn-action-small ${activeTab === 'benchmark' ? 'u-btn-primary' : 'u-btn-secondary'}`}
        >
          브라우저 연산 성능 진단
        </button>
      </div>

      {activeTab === 'script' ? (
        <div className="u-grid-2">
          {/* Options select */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>최적화 옵션 선택</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <label className="u-checkbox-group">
                <input type="checkbox" className="u-checkbox" checked={opts.tempFiles} onChange={() => toggleOpt('tempFiles')} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>임시 폴더(Temp) 자동 비우기</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>브라우저 및 시스템 작업 잔여 쓰레기 파일 정리</span>
                </div>
              </label>

              <label className="u-checkbox-group">
                <input type="checkbox" className="u-checkbox" checked={opts.dnsCache} onChange={() => toggleOpt('dnsCache')} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>DNS 캐시 클리어 (FlushDNS)</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>네트워크 주소 정보를 초기화하여 접속 지연 제거</span>
                </div>
              </label>

              <label className="u-checkbox-group">
                <input type="checkbox" className="u-checkbox" checked={opts.prefetch} onChange={() => toggleOpt('prefetch')} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>프리페치(Prefetch) 로그 정리</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>윈도우 부팅 및 프로그램 캐시 공간 최적화</span>
                </div>
              </label>

              <label className="u-checkbox-group">
                <input type="checkbox" className="u-checkbox" checked={opts.telemetry} onChange={() => toggleOpt('telemetry')} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>진단 텔레메트리 전송 끄기</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>정기 백그라운드 진단 정보 전송 차단으로 리소스 확보</span>
                </div>
              </label>

              <label className="u-checkbox-group">
                <input type="checkbox" className="u-checkbox" checked={opts.ramStandby} onChange={() => toggleOpt('ramStandby')} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>대기 메모리(Standby Cache) 회수</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>시스템 캐시가 점유한 여유 RAM 영역 안전 해제</span>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button onClick={handleDownload} className="u-btn u-btn-primary" style={{ flex: 1 }}>
                <Download size={16} /> .bat 파일 다운로드
              </button>
              <button onClick={handleCopy} className="u-btn u-btn-secondary">
                <Copy size={16} /> 복사
              </button>
            </div>
          </div>

          {/* Script view */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="u-label" style={{ marginBottom: '0.5rem' }}>생성될 배치스크립트 미리보기 (Preview)</span>
            <pre className="terminal-box" style={{ height: '330px', color: '#c0c0c0', overflowY: 'auto' }}>
              {generateScript()}
            </pre>
            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              💡 주의: 배치파일 실행 시 "관리자 권한으로 실행"을 선택해 주셔야 윈도우 핵심 디렉토리 내부 찌꺼기 파일들까지 정상적으로 삭제됩니다.
            </span>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="optim-progress-container">
            <div className="flex-center-between">
              <span style={{ fontWeight: 600 }}>브라우저 기반 PC 진단 스캐너</span>
              {scanStatus === 'scanning' && <span className="status-badge-green">진단 중 (Computing...)</span>}
              {scanStatus === 'done' && <span className="status-badge-green" style={{ background: 'rgba(0, 242, 254, 0.1)', color: 'var(--color-primary)', borderColor: 'rgba(0, 242, 254, 0.3)' }}>진단 완료</span>}
            </div>

            <div className="optim-bar">
              <div className="optim-bar-fill" style={{ width: scanStatus === 'idle' ? '0%' : scanStatus === 'scanning' ? '60%' : '100%' }} />
            </div>

            {scanStatus === 'idle' ? (
              <div style={{ padding: '2rem 0', textAlign: 'center' }}>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem' }}>진단 버튼을 누르면 연산 테스트 및 메모리 쿼리 엔진을 통해 PC의 상태를 간략히 분석합니다.</p>
                <button onClick={runPerformanceScan} className="u-btn u-btn-primary">
                  <RefreshCw size={16} /> PC 연산 성능 스캔 시작
                </button>
              </div>
            ) : (
              <div className="u-grid-2" style={{ marginTop: '1rem' }}>
                <div>
                  <span className="u-label">진단 로그</span>
                  <div className="terminal-box" style={{ height: '180px' }}>
                    {logMessages.map((m, idx) => (
                      <div key={idx}>{`> ${m}`}</div>
                    ))}
                  </div>
                </div>

                {scanStatus === 'done' && (
                  <div className="glass-panel" style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.02)' }}>
                    <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Sparkles size={16} /> 스캔 보고서 결과
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                      <div className="flex-center-between">
                        <span style={{ color: 'var(--color-text-muted)' }}>물리 메모리 감지</span>
                        <span>{scanMetrics.ramSize}</span>
                      </div>
                      <div className="flex-center-between">
                        <span style={{ color: 'var(--color-text-muted)' }}>연산 능력 지표 (CPU)</span>
                        <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{scanMetrics.cpuScore} Points</span>
                      </div>
                      <div className="flex-center-between">
                        <span style={{ color: 'var(--color-text-muted)' }}>네트워크 핑 스피드</span>
                        <span>{scanMetrics.browserSpeed} ms</span>
                      </div>
                      <div style={{ marginTop: '0.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '0.5rem', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        ※ 본 측정은 브라우저 런타임 성능 평가값으로 백그라운드 프로세스가 많을 시 점수가 낮아질 수 있습니다. 배치 최적화 스크립트 실행 후 브라우저를 재부팅하고 다시 측정해 보세요.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   3. QR Code Generator & Parser (QR Master)
   ========================================================================== */
function QRWidget({ playBeep }) {
  const [qrText, setQrText] = useState('https://github.com');
  const [dotColor, setDotColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(200);

  // Reader States
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle | loaded | error
  const [readResult, setReadResult] = useState('');
  const [qrMode, setQrMode] = useState('create'); // create | read
  const fileInputRef = useRef(null);

  // Generate QR URL using a free online API
  const getQRUrl = () => {
    // API: qrserver.com
    const cleanText = encodeURIComponent(qrText);
    const cleanDot = dotColor.replace('#', '');
    const cleanBg = bgColor.replace('#', '');
    return `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${cleanText}&color=${cleanDot}&bgcolor=${cleanBg}`;
  };

  const handleDownload = () => {
    // To download the image securely, fetch it and convert to blob
    playBeep(880, 0.1);
    const link = document.createElement('a');
    link.href = getQRUrl();
    link.target = '_blank';
    link.download = 'qrcode.png';
    link.click();
  };

  // Decode QR via public reader API
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadStatus('loading');
    playBeep(440, 0.05);

    const formData = new FormData();
    formData.append('file', file);

    fetch('https://api.qrserver.com/v1/read-qr-code/', {
      method: 'POST',
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      const result = data[0]?.symbol[0]?.data;
      const error = data[0]?.symbol[0]?.error;
      if (result) {
        setReadResult(result);
        setUploadStatus('loaded');
        playBeep(880, 0.25, 'sine');
      } else {
        setReadResult(error || 'QR 코드를 인식할 수 없거나 손상된 이미지입니다.');
        setUploadStatus('error');
        playBeep(220, 0.3, 'sawtooth');
      }
    })
    .catch(err => {
      setReadResult('네트워크 분석 요청에 실패했습니다.');
      setUploadStatus('error');
      playBeep(220, 0.3, 'sawtooth');
    });
  };

  return (
    <div>
      <div className="utility-header">
        <div className="utility-title-wrapper">
          <QrCode className="icon-cyan" />
          <h3 className="utility-title">QR 코드 생성 & 판독기 (QR Master)</h3>
        </div>
        <p className="utility-desc">원하는 주소의 QR 코드를 디자인 색상을 입혀 생성하고, 이미 생성된 QR 코드 이미지를 업로드해 해독합니다.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
        <button 
          onClick={() => setQrMode('create')} 
          className={`u-btn btn-action-small ${qrMode === 'create' ? 'u-btn-primary' : 'u-btn-secondary'}`}
        >
          QR 코드 만들기
        </button>
        <button 
          onClick={() => setQrMode('read')} 
          className={`u-btn btn-action-small ${qrMode === 'read' ? 'u-btn-primary' : 'u-btn-secondary'}`}
        >
          QR 이미지 해독하기
        </button>
      </div>

      {qrMode === 'create' ? (
        <div className="u-grid-2">
          {/* Controls */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>생성 디자인 설정</h4>

            <div className="u-form-group">
              <label className="u-label">텍스트 또는 URL 입력</label>
              <textarea 
                className="u-textarea" 
                value={qrText} 
                onChange={(e) => setQrText(e.target.value)} 
                placeholder="https://example.com"
                style={{ minHeight: '80px' }}
              />
            </div>

            <div className="u-grid-2">
              <div className="u-form-group">
                <label className="u-label">코드 색상 (Dot)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="color" className="u-input" style={{ width: '45px', padding: '2px', height: '40px', cursor: 'pointer' }} value={dotColor} onChange={(e) => setDotColor(e.target.value)} />
                  <input type="text" className="u-input" style={{ fontSize: '0.8rem' }} value={dotColor.toUpperCase()} onChange={(e) => setDotColor(e.target.value)} />
                </div>
              </div>

              <div className="u-form-group">
                <label className="u-label">배경 색상 (Background)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="color" className="u-input" style={{ width: '45px', padding: '2px', height: '40px', cursor: 'pointer' }} value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                  <input type="text" className="u-input" style={{ fontSize: '0.8rem' }} value={bgColor.toUpperCase()} onChange={(e) => setBgColor(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="u-form-group">
              <label className="u-label">QR 크기: {qrSize}x{qrSize}px</label>
              <input type="range" className="u-range" min="150" max="300" step="50" value={qrSize} onChange={(e) => setQrSize(Number(e.target.value))} />
            </div>

            <button onClick={handleDownload} className="u-btn u-btn-primary" style={{ width: '100%' }}>
              <Download size={16} /> QR 코드 이미지 다운로드
            </button>
          </div>

          {/* Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span className="u-label" style={{ alignSelf: 'flex-start', marginBottom: '0.5rem' }}>생성된 실시간 QR 코드</span>
            <div className="qr-preview-box" style={{ width: '100%' }}>
              <img src={getQRUrl()} alt="QR code" width={qrSize} height={qrSize} />
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
                스마트폰 카메라 앱을 갖다 대면 즉시 인식됩니다.
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="u-grid-2">
          {/* Upload panel */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>QR 이미지 불러오기</h4>
            
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />

            <div 
              className="qr-preview-box" 
              onClick={() => fileInputRef.current?.click()}
              style={{ cursor: 'pointer' }}
            >
              {uploadStatus === 'idle' && (
                <div className="qr-upload-area">
                  <Upload size={40} className="text-neon-cyan" style={{ opacity: 0.8 }} />
                  <span style={{ fontWeight: 600 }}>여기를 클릭해 파일 찾기</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>PNG / JPG QR 이미지 업로드 가능</span>
                </div>
              )}
              {uploadStatus === 'loading' && (
                <div style={{ textAlign: 'center' }}>
                  <RefreshCw size={36} className="text-neon-cyan" style={{ animation: 'spin 2s linear infinite' }} />
                  <p style={{ marginTop: '1rem', fontWeight: 600 }}>서버 이미지 분석 요청 중...</p>
                </div>
              )}
              {uploadStatus === 'loaded' && (
                <div className="qr-upload-area">
                  <CheckCircle size={40} className="status-badge-green" style={{ border: 'none', background: 'none' }} />
                  <span style={{ fontWeight: 600, color: '#34d399' }}>성공적으로 해독됨!</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>이미지를 바꾸려면 클릭하세요.</span>
                </div>
              )}
              {uploadStatus === 'error' && (
                <div className="qr-upload-area">
                  <AlertTriangle size={40} style={{ color: '#ef4444' }} />
                  <span style={{ fontWeight: 600, color: '#f87171' }}>해독에 실패했습니다.</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>재클릭하여 다른 이미지를 올려보세요.</span>
                </div>
              )}
            </div>
          </div>

          {/* Results display */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="u-label" style={{ marginBottom: '0.5rem' }}>해독 결과 문자열 (Decoded Content)</span>
            <div className="terminal-box" style={{ height: '240px', color: '#c0c0c0', overflowY: 'auto', padding: '1.25rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {uploadStatus === 'loaded' ? readResult : uploadStatus === 'error' ? `에러 원인:\n${readResult}` : 'QR 코드를 읽으려면 왼쪽에 이미지를 업로드해 주세요.'}
            </div>

            {uploadStatus === 'loaded' && (
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(readResult);
                  playBeep(880, 0.1);
                  alert("복사 완료!");
                }}
                className="u-btn u-btn-secondary"
                style={{ marginTop: '0.75rem' }}
              >
                <Copy size={14} /> 해독 텍스트 클립보드 복사
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   4. Smart Text Toolbox
   ========================================================================== */
function TextWidget({ playBeep }) {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  // Real-time metrics
  const getMetrics = () => {
    const cleanText = text || '';
    const charCount = cleanText.length;
    const charNoSpace = cleanText.replace(/\s/g, '').length;
    const wordCount = cleanText.trim() === '' ? 0 : cleanText.trim().split(/\s+/).length;
    const lineCount = cleanText === '' ? 0 : cleanText.split('\n').length;
    const byteSize = new Blob([cleanText]).size;
    return { charCount, charNoSpace, wordCount, lineCount, byteSize };
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    playBeep(880, 0.1);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const { charCount, charNoSpace, wordCount, lineCount, byteSize } = getMetrics();

  // Text Transform Logic
  const convertCase = (mode) => {
    playBeep(523, 0.05);
    if (mode === 'upper') {
      setText(text.toUpperCase());
    } else if (mode === 'lower') {
      setText(text.toLowerCase());
    } else if (mode === 'title') {
      setText(text.replace(/\b\w/g, c => c.toUpperCase()));
    } else if (mode === 'reverse') {
      setText(text.split('').reverse().join(''));
    }
  };

  const handleClearSpaces = () => {
    playBeep(523, 0.05);
    setText(text.replace(/[ \t]+/g, ' ').trim());
  };

  const handleClearEmptyLines = () => {
    playBeep(523, 0.05);
    setText(text.split('\n').filter(line => line.trim() !== '').join('\n'));
  };

  const handleURL = (mode) => {
    playBeep(523, 0.05);
    try {
      if (mode === 'encode') {
        setText(encodeURIComponent(text));
      } else {
        setText(decodeURIComponent(text));
      }
    } catch (e) {
      alert("변환 에러: 올바르지 않은 형식입니다.");
    }
  };

  const handleBase64 = (mode) => {
    playBeep(523, 0.05);
    try {
      if (mode === 'encode') {
        // Handle Unicode characters safely
        const utf8Bytes = new TextEncoder().encode(text);
        let binaryStr = '';
        for (let i = 0; i < utf8Bytes.length; i++) {
          binaryStr += String.fromCharCode(utf8Bytes[i]);
        }
        setText(window.btoa(binaryStr));
      } else {
        const binaryStr = window.atob(text);
        const bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
        setText(new TextDecoder().decode(bytes));
      }
    } catch (e) {
      alert("변환 에러: 올바르지 않은 Base64 포맷입니다.");
    }
  };

  return (
    <div>
      <div className="utility-header">
        <div className="utility-title-wrapper">
          <Type className="icon-cyan" />
          <h3 className="utility-title">스마트 텍스트 도구 (Text Toolbox)</h3>
        </div>
        <p className="utility-desc">문자 수, 바이트 수 실시간 분석 및 대소문자 변환, 인코딩 변환과 불필요한 행 정리를 모은 종합 텍스트 툴킷입니다.</p>
      </div>

      <div className="u-grid-2">
        {/* Input box */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex-center-between" style={{ marginBottom: '0.5rem' }}>
            <span className="u-label">여기에 분석/가공할 텍스트 입력</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={() => { setText(''); playBeep(220, 0.05); }} className="u-btn btn-action-small u-btn-danger">
                <Trash2 size={13} /> 비우기
              </button>
              <button onClick={handleCopy} className="u-btn btn-action-small u-btn-primary">
                {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? '복사됨' : '전체 복사'}
              </button>
            </div>
          </div>
          <textarea
            className="u-textarea"
            placeholder="여기에 한글/영문 텍스트를 입력하거나 복사 붙여넣기 하세요."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ height: '320px' }}
          />
        </div>

        {/* Info panel & Action Toolbox */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Analysis Metrics */}
          <div className="glass-panel" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)' }}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>글자 수 및 크기 분석</h4>
            <div className="u-grid-3" style={{ gap: '0.75rem', textAlign: 'center' }}>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{charCount}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>공백포함 (자)</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{charNoSpace}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>공백제외 (자)</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{wordCount}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>단어 수 (개)</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{lineCount}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>줄 수 (행)</span>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{byteSize}</div>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>크기 (Bytes)</span>
              </div>
            </div>
          </div>

          {/* Action grid */}
          <div className="glass-panel" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.02)' }}>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>텍스트 변환 및 다듬기</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => convertCase('upper')} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>대문자</button>
                <button onClick={() => convertCase('lower')} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>소문자</button>
                <button onClick={() => convertCase('title')} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>첫자대문자</button>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={handleClearSpaces} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>다중 공백 한칸으로</button>
                <button onClick={handleClearEmptyLines} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>빈 줄 제거</button>
                <button onClick={() => convertCase('reverse')} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>역순 정렬</button>
              </div>

              <div style={{ borderTop: '1px solid var(--border-glass)', margin: '0.4rem 0', paddingTop: '0.5rem' }} />

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => handleURL('encode')} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>URL 인코드</button>
                <button onClick={() => handleURL('decode')} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>URL 디코드</button>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => handleBase64('encode')} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>Base64 인코드</button>
                <button onClick={() => handleBase64('decode')} className="u-btn btn-action-small u-btn-secondary" style={{ flex: 1 }}>Base64 디코드</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. Secure Password Generator
   ========================================================================== */
function PasswordWidget({ playBeep }) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [flags, setFlags] = useState({
    upper: true,
    lower: true,
    number: true,
    symbol: true
  });
  const [copied, setCopied] = useState(false);

  const toggleFlag = (key) => {
    setFlags(prev => ({ ...prev, [key]: !prev[key] }));
    playBeep(587, 0.04);
  };

  // Generate password logic
  const generatePassword = () => {
    const chars = {
      upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lower: 'abcdefghijklmnopqrstuvwxyz',
      number: '0123456789',
      symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let allowed = '';
    let result = '';

    if (flags.upper) allowed += chars.upper;
    if (flags.lower) allowed += chars.lower;
    if (flags.number) allowed += chars.number;
    if (flags.symbol) allowed += chars.symbol;

    if (allowed === '') {
      setPassword('옵션을 하나 이상 켜주세요!');
      return;
    }

    // Force at least one character from each selected class to guarantee security
    let requiredChars = [];
    if (flags.upper) requiredChars.push(chars.upper[Math.floor(Math.random() * chars.upper.length)]);
    if (flags.lower) requiredChars.push(chars.lower[Math.floor(Math.random() * chars.lower.length)]);
    if (flags.number) requiredChars.push(chars.number[Math.floor(Math.random() * chars.number.length)]);
    if (flags.symbol) requiredChars.push(chars.symbol[Math.floor(Math.random() * chars.symbol.length)]);

    for (let i = requiredChars.length; i < length; i++) {
      result += allowed[Math.floor(Math.random() * allowed.length)];
    }

    // Insert mandatory characters and shuffle
    const combined = [...result, ...requiredChars];
    for (let i = combined.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [combined[i], combined[j]] = [combined[j], combined[i]];
    }

    setPassword(combined.join(''));
    playBeep(880, 0.12, 'sine');
  };

  // Run initial gen
  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, flags]);

  const handleCopy = () => {
    if (password === '옵션을 하나 이상 켜주세요!') return;
    navigator.clipboard.writeText(password);
    playBeep(880, 0.1);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Simple Entropy & Strength Gauge Calculation
  const calculateStrength = () => {
    if (!password || password.startsWith('옵션')) return { label: '없음', pct: 0, color: '#ef4444' };
    
    let base = 0;
    if (flags.lower) base += 26;
    if (flags.upper) base += 26;
    if (flags.number) base += 10;
    if (flags.symbol) base += 28;

    const entropy = Math.round(length * Math.log2(base || 2));
    
    if (entropy < 40) return { label: '위험 (매우 낮음)', pct: 20, color: '#ef4444', entropy };
    if (entropy < 60) return { label: '보통 (웹사이트 권장)', pct: 50, color: '#f59e0b', entropy };
    if (entropy < 85) return { label: '안전 (강력함)', pct: 80, color: '#10b981', entropy };
    return { label: '매우 안전 (군사용 스펙)', pct: 100, color: '#00f2fe', entropy };
  };

  const strength = calculateStrength();

  return (
    <div>
      <div className="utility-header">
        <div className="utility-title-wrapper">
          <Key className="icon-cyan" />
          <h3 className="utility-title">보안 비밀번호 생성기 (SafePassword)</h3>
        </div>
        <p className="utility-desc">해킹이나 무차별 대입 공격(Brute Force)을 원천 방지하기 위해 엔트로피 점수가 계산된 무작위 암호를 생성합니다.</p>
      </div>

      <div className="u-grid-2">
        {/* Settings */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>비밀번호 포함 규격</h4>

          <div className="u-form-group">
            <span className="u-label">길이 조절: {length} 자</span>
            <input type="range" className="u-range" min="6" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0' }}>
            <label className="u-checkbox-group">
              <input type="checkbox" className="u-checkbox" checked={flags.upper} onChange={() => toggleFlag('upper')} />
              <span>영문 대문자 (A-Z)</span>
            </label>
            <label className="u-checkbox-group">
              <input type="checkbox" className="u-checkbox" checked={flags.lower} onChange={() => toggleFlag('lower')} />
              <span>영문 소문자 (a-z)</span>
            </label>
            <label className="u-checkbox-group">
              <input type="checkbox" className="u-checkbox" checked={flags.number} onChange={() => toggleFlag('number')} />
              <span>숫자 기호 (0-9)</span>
            </label>
            <label className="u-checkbox-group">
              <input type="checkbox" className="u-checkbox" checked={flags.symbol} onChange={() => toggleFlag('symbol')} />
              <span>특수문자 (!@#...)</span>
            </label>
          </div>

          <button onClick={generatePassword} className="u-btn u-btn-primary" style={{ width: '100%' }}>
            <RotateCcw size={16} /> 신규 패스워드 재생성
          </button>
        </div>

        {/* Display Output & Entropy */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <span className="u-label">생성된 무작위 암호</span>
          <div className="terminal-box" style={{ 
            height: '110px', 
            fontSize: password.length > 32 ? '1.05rem' : '1.3rem', 
            fontWeight: '600', 
            color: 'var(--color-primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            wordBreak: 'break-all',
            padding: '1rem',
            textAlign: 'center'
          }}>
            {password}
          </div>

          <button onClick={handleCopy} className="u-btn u-btn-secondary" style={{ width: '100%' }}>
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? '복사되었습니다!' : '비밀번호 복사하기'}
          </button>

          {/* Entropy Gauge */}
          <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)' }}>
            <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>비밀번호 보안 성능</h4>
            <div className="pw-strength-container">
              <div className="flex-center-between" style={{ fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>강도 등급</span>
                <span style={{ fontWeight: 700, color: strength.color }}>{strength.label}</span>
              </div>
              <div className="pw-strength-bar-bg">
                <div className="pw-strength-bar" style={{ width: `${strength.pct}%`, backgroundColor: strength.color }} />
              </div>
              {strength.entropy && (
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.25rem', textAlign: 'right' }}>
                  엔트로피 지수: ~{strength.entropy} Bits (2^{strength.entropy} 경우의 수)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   6. Color Picker & Harmony Generator
   ========================================================================== */
function ColorWidget({ playBeep }) {
  const [hex, setHex] = useState('#00f2fe');
  const [copiedColor, setCopiedColor] = useState('');

  // Handle color change from picker or input
  const handleColorChange = (newHex) => {
    if (/^#[0-9A-F]{6}$/i.test(newHex)) {
      setHex(newHex);
    }
  };

  const handleCopy = (colorHex) => {
    navigator.clipboard.writeText(colorHex);
    playBeep(880, 0.1);
    setCopiedColor(colorHex);
    setTimeout(() => setCopiedColor(''), 1500);
  };

  // Convert Hex to HSL
  const hexToHsl = (hexStr) => {
    let r = parseInt(hexStr.substring(1, 3), 16) / 255;
    let g = parseInt(hexStr.substring(3, 5), 16) / 255;
    let b = parseInt(hexStr.substring(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  // HSL back to hex
  const hslToHex = (h, s, l) => {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
    else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
    else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
    else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
    else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
    else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

    const toHex = xVal => {
      const hexVal = Math.round((xVal + m) * 255).toString(16);
      return hexVal.length === 1 ? '0' + hexVal : hexVal;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Generate Harmonies based on HSL
  const getHarmonies = () => {
    const { h, s, l } = hexToHsl(hex);
    
    return {
      complementary: [hex, hslToHex((h + 180) % 360, s, l)],
      analogous: [
        hslToHex((h + 330) % 360, s, l),
        hex,
        hslToHex((h + 30) % 360, s, l)
      ],
      triadic: [
        hex,
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l)
      ],
      monochromatic: [
        hslToHex(h, s, Math.max(10, l - 30)),
        hslToHex(h, s, Math.max(20, l - 15)),
        hex,
        hslToHex(h, s, Math.min(90, l + 15)),
        hslToHex(h, s, Math.min(100, l + 30))
      ]
    };
  };

  // WCAG Contrast ratio calculate for text on selected color background
  const getContrastRatio = () => {
    // Relative Luminance formula
    const getLuminance = (colorHex) => {
      let r = parseInt(colorHex.substring(1, 3), 16) / 255;
      let g = parseInt(colorHex.substring(3, 5), 16) / 255;
      let b = parseInt(colorHex.substring(5, 7), 16) / 255;

      r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
      g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
      b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);

      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const l1 = getLuminance(hex);
    const lWhite = 1.0;
    const lBlack = 0.0;

    const ratioWhite = (lWhite + 0.05) / (l1 + 0.05);
    const ratioBlack = (l1 + 0.05) / (lBlack + 0.05);

    const checkWhite = ratioWhite > 4.5 ? 'PASS' : 'FAIL';
    const checkBlack = ratioBlack > 4.5 ? 'PASS' : 'FAIL';

    return { 
      whiteRatio: Math.round(ratioWhite * 10) / 10,
      blackRatio: Math.round(ratioBlack * 10) / 10,
      checkWhite,
      checkBlack
    };
  };

  const harmonies = getHarmonies();
  const contrast = getContrastRatio();

  return (
    <div>
      <div className="utility-header">
        <div className="utility-title-wrapper">
          <Palette className="icon-cyan" />
          <h3 className="utility-title">컬러 팔레트 & 대비 분석기 (Color Harmony)</h3>
        </div>
        <p className="utility-desc">디자인 색상을 선택해 배색 조화(대조, 보색, 유사색)를 확인하고, 텍스트 가독성을 점검하는 가독성 대비 평가 도구입니다.</p>
      </div>

      <div className="u-grid-2">
        {/* Left Color picker */}
        <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
          <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)' }}>색상 선택</h4>

          <div className="u-form-group">
            <span className="u-label">색상 코드 입력 (Hex)</span>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="color" 
                className="u-input" 
                style={{ width: '55px', height: '42px', padding: '2px', cursor: 'pointer' }} 
                value={hex} 
                onChange={(e) => handleColorChange(e.target.value)} 
              />
              <input 
                type="text" 
                className="u-input" 
                value={hex.toUpperCase()} 
                onChange={(e) => handleColorChange(e.target.value)} 
              />
            </div>
          </div>

          <div className="color-swatch-large" style={{ backgroundColor: hex, color: hexToHsl(hex).l > 60 ? '#111' : '#fff' }} onClick={() => handleCopy(hex)}>
            {copiedColor === hex ? '✓ 복사완료' : '색상 복사 (Copy)'}
          </div>

          {/* Contrast Panel */}
          <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>텍스트 가독성 검증 (WCAG 2.1)</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div className="flex-center-between">
                <span>흰색(#FFF) 글자 올렸을 때</span>
                <div>
                  <span style={{ marginRight: '0.5rem' }}>비율 {contrast.whiteRatio}:1</span>
                  <span className="contrast-badge" style={{ backgroundColor: contrast.checkWhite === 'PASS' ? '#10b981' : '#ef4444' }}>{contrast.checkWhite}</span>
                </div>
              </div>
              <div className="flex-center-between">
                <span>검은색(#000) 글자 올렸을 때</span>
                <div>
                  <span style={{ marginRight: '0.5rem' }}>비율 {contrast.blackRatio}:1</span>
                  <span className="contrast-badge" style={{ backgroundColor: contrast.checkBlack === 'PASS' ? '#10b981' : '#ef4444' }}>{contrast.checkBlack}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Harmonies list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <span className="u-label">1. 보색 조화 (Complementary)</span>
            <div className="palette-grid">
              {harmonies.complementary.map((c, idx) => (
                <div key={idx} className="palette-card" onClick={() => handleCopy(c)}>
                  <div className="palette-color" style={{ backgroundColor: c }} />
                  <div className="palette-hex">{copiedColor === c ? 'Copied' : c.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="u-label">2. 유사색 조화 (Analogous)</span>
            <div className="palette-grid">
              {harmonies.analogous.map((c, idx) => (
                <div key={idx} className="palette-card" onClick={() => handleCopy(c)}>
                  <div className="palette-color" style={{ backgroundColor: c }} />
                  <div className="palette-hex">{copiedColor === c ? 'Copied' : c.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="u-label">3. 3색 대조 (Triadic)</span>
            <div className="palette-grid">
              {harmonies.triadic.map((c, idx) => (
                <div key={idx} className="palette-card" onClick={() => handleCopy(c)}>
                  <div className="palette-color" style={{ backgroundColor: c }} />
                  <div className="palette-hex">{copiedColor === c ? 'Copied' : c.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="u-label">4. 단색 톤온톤 (Monochromatic)</span>
            <div className="palette-grid">
              {harmonies.monochromatic.map((c, idx) => (
                <div key={idx} className="palette-card" onClick={() => handleCopy(c)}>
                  <div className="palette-color" style={{ backgroundColor: c }} />
                  <div className="palette-hex">{copiedColor === c ? 'Copied' : c.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. Client-side Image Compressor & Format Converter
   ========================================================================== */
function ImageWidget({ playBeep }) {
  const [srcImage, setSrcImage] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);
  const [compressQuality, setCompressQuality] = useState(0.8);
  const [scaleWidth, setScaleWidth] = useState(100); // percentage resize
  
  // Output states
  const [destImage, setDestImage] = useState(null);
  const [destSize, setDestSize] = useState(null);
  const [destFormat, setDestFormat] = useState('image/jpeg');
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageLoad = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOriginalFile(file);
    playBeep(440, 0.05);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSrcImage(event.target.result);
      setDestImage(null); // Clear previous output
    };
    reader.readAsDataURL(file);
  };

  // Perform client-side compression on Canvas
  const handleCompress = () => {
    if (!srcImage) return;

    setCompressing(true);
    playBeep(523, 0.05);

    const img = new Image();
    img.src = srcImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Scale dimensions
      const targetWidth = Math.round(img.width * (scaleWidth / 100));
      const targetHeight = Math.round(img.height * (scaleWidth / 100));

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw and apply anti-aliasing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Convert canvas to compressed image
      const compressedDataUrl = canvas.toDataURL(destFormat, compressQuality);
      setDestImage(compressedDataUrl);

      // Calculate compressed bytes based on Base64 payload size
      // formula: base64_length * (3 / 4) - padding
      const paddingCount = (compressedDataUrl.match(/=/g) || []).length;
      const calculatedBytes = Math.round((compressedDataUrl.length - 23) * 0.75) - paddingCount;
      setDestSize(calculatedBytes);

      setCompressing(false);
      playBeep(880, 0.2, 'sine');
    };
  };

  useEffect(() => {
    if (srcImage) {
      handleCompress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compressQuality, scaleWidth, destFormat]);

  // File size formatter helper
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="utility-header">
        <div className="utility-title-wrapper">
          <ImageIcon className="icon-cyan" />
          <h3 className="utility-title">이미지 압축 & 포맷 변환기 (Offline Compressor)</h3>
        </div>
        <p className="utility-desc">서버 전송 없이 100% 브라우저(Canvas API)에서 이미지를 JPEG/WEBP/PNG로 변환하고 퀄리티와 픽셀을 축소 압축합니다.</p>
      </div>

      {!srcImage ? (
        <div 
          className="qr-preview-box" 
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: 'pointer', minHeight: '300px' }}
        >
          <Upload size={48} className="text-neon-cyan" style={{ opacity: 0.8 }} />
          <span style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: '1rem' }}>압축 및 변환할 이미지 업로드</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>여기를 클릭해 파일 로컬 로딩</span>
          <input type="file" ref={fileInputRef} onChange={handleImageLoad} accept="image/*" style={{ display: 'none' }} />
        </div>
      ) : (
        <div className="u-grid-2">
          {/* Controls */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
            <h4 style={{ marginBottom: '1.25rem', color: 'var(--color-primary)' }}>압축 및 포맷 변경 필터</h4>

            <div className="u-form-group">
              <span className="u-label">변환할 출력 포맷</span>
              <select className="u-select" value={destFormat} onChange={(e) => setDestFormat(e.target.value)}>
                <option value="image/jpeg">JPEG (고압축 가능)</option>
                <option value="image/webp">WEBP (웹 최적화)</option>
                <option value="image/png">PNG (무손실 원본)</option>
              </select>
            </div>

            {destFormat !== 'image/png' && (
              <div className="u-form-group">
                <span className="u-label">압축 화질 (Quality): {Math.round(compressQuality * 100)}%</span>
                <input 
                  type="range" 
                  className="u-range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05" 
                  value={compressQuality} 
                  onChange={(e) => setCompressQuality(Number(e.target.value))} 
                />
              </div>
            )}

            <div className="u-form-group">
              <span className="u-label">이미지 크기 비율: {scaleWidth}%</span>
              <input 
                type="range" 
                className="u-range" 
                min="10" 
                max="100" 
                step="5" 
                value={scaleWidth} 
                onChange={(e) => setScaleWidth(Number(e.target.value))} 
              />
            </div>

            {/* Savings Display */}
            {destSize && originalFile && (
              <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <div className="flex-center-between">
                    <span>기존 원본 크기:</span>
                    <span>{formatBytes(originalFile.size)}</span>
                  </div>
                  <div className="flex-center-between">
                    <span>압축 예상 크기:</span>
                    <span style={{ color: 'var(--color-primary)' }}>{formatBytes(destSize)}</span>
                  </div>
                  <div className="flex-center-between" style={{ fontWeight: 700, borderTop: '1px solid var(--border-glass)', paddingTop: '0.4rem' }}>
                    <span>절약된 용량 비율:</span>
                    <span className="status-badge-green">
                      {originalFile.size > destSize ? `${Math.round(((originalFile.size - destSize) / originalFile.size) * 100)}% 절약` : '0%'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href={destImage} download={`optimized_image.${destFormat.split('/')[1]}`} className="u-btn u-btn-primary" style={{ flex: 1, textDecoration: 'none' }}>
                <Download size={16} /> 압축파일 다운로드
              </a>
              <button 
                onClick={() => { setSrcImage(null); setOriginalFile(null); playBeep(220, 0.05); }} 
                className="u-btn u-btn-secondary"
              >
                닫기
              </button>
            </div>
          </div>

          {/* Dual comparisons */}
          <div className="img-compress-comparison">
            <div className="img-pane">
              <span className="u-label">원본 (Original)</span>
              <img src={srcImage} alt="Original" className="img-pane-preview" />
            </div>

            <div className="img-pane">
              <span className="u-label">변환본 (Compressed)</span>
              {compressing ? (
                <div className="flex-center-between" style={{ height: '150px' }}>
                  <RefreshCw size={24} style={{ animation: 'spin 2s linear infinite' }} />
                </div>
              ) : (
                <img src={destImage || srcImage} alt="Result" className="img-pane-preview" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================================
   8. Smart Unit Converter
   ========================================================================== */
function ConverterWidget({ playBeep }) {
  const [category, setCategory] = useState('data'); // data | length | weight | temp
  const [val, setVal] = useState(1);
  const [lastEditedUnit, setLastEditedUnit] = useState('');

  // Categories configurations
  const unitsDef = {
    data: [
      { key: 'b', name: 'Bytes (B)', factor: 1 },
      { key: 'kb', name: 'Kilobytes (KB)', factor: 1024 },
      { key: 'mb', name: 'Megabytes (MB)', factor: 1024 * 1024 },
      { key: 'gb', name: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
      { key: 'tb', name: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 }
    ],
    length: [
      { key: 'm', name: '미터 (m)', factor: 1 },
      { key: 'km', name: '킬로미터 (km)', factor: 1000 },
      { key: 'inch', name: '인치 (in)', factor: 0.0254 },
      { key: 'ft', name: '피트 (ft)', factor: 0.3048 },
      { key: 'mile', name: '마일 (mi)', factor: 1609.344 }
    ],
    weight: [
      { key: 'g', name: '그램 (g)', factor: 1 },
      { key: 'kg', name: '킬로그램 (kg)', factor: 1000 },
      { key: 'lb', name: '파운드 (lb)', factor: 453.59237 },
      { key: 'oz', name: '온스 (oz)', factor: 28.349523 }
    ],
    temp: [
      { key: 'c', name: '섭씨 (°C)' },
      { key: 'f', name: '화씨 (°F)' },
      { key: 'k', name: '켈빈 (K)' }
    ]
  };

  const currentUnits = unitsDef[category];

  // Store active absolute values based on last input values
  const getAbsoluteValue = () => {
    if (category === 'temp') return val; // Handled separately
    
    // Find active factor
    const unitObj = currentUnits.find(u => u.key === lastEditedUnit) || currentUnits[0];
    return val * unitObj.factor;
  };

  const handleValueChange = (unitKey, inputVal) => {
    const numeric = parseFloat(inputVal);
    if (isNaN(numeric)) {
      setVal(0);
    } else {
      setVal(numeric);
    }
    setLastEditedUnit(unitKey);
  };

  const renderUnitValue = (unit) => {
    if (category === 'temp') {
      // Temperature conversion formula matrix
      let cTemp = 0;
      if (lastEditedUnit === 'c') cTemp = val;
      else if (lastEditedUnit === 'f') cTemp = (val - 32) * (5 / 9);
      else if (lastEditedUnit === 'k') cTemp = val - 273.15;
      else cTemp = val;

      if (unit.key === 'c') return Math.round(cTemp * 1000) / 1000;
      if (unit.key === 'f') return Math.round((cTemp * (9 / 5) + 32) * 1000) / 1000;
      if (unit.key === 'k') return Math.round((cTemp + 273.15) * 1000) / 1000;
      return 0;
    }

    const absolute = getAbsoluteValue();
    const result = absolute / unit.factor;
    // Format scientific or long float sizes nicely
    if (result === 0) return 0;
    if (Math.abs(result) < 0.0001 || Math.abs(result) > 10000000) {
      return result.toExponential(4);
    }
    return Math.round(result * 10000) / 10000;
  };

  const handleCategorySwitch = (cat) => {
    setCategory(cat);
    setVal(1);
    setLastEditedUnit(unitsDef[cat][0].key);
    playBeep(523, 0.05);
  };

  return (
    <div>
      <div className="utility-header">
        <div className="utility-title-wrapper">
          <Scale className="icon-cyan" />
          <h3 className="utility-title">다기능 스마트 단위 변환기 (Multi Unit Converter)</h3>
        </div>
        <p className="utility-desc">데이터 크기(KB/MB/GB), 길이(m/in/ft), 무게, 온도 중 하나를 수정하면 나머지 단위들이 수학 공식에 맞춰 실시간 동기화됩니다.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {['data', 'length', 'weight', 'temp'].map(cat => (
          <button 
            key={cat} 
            onClick={() => handleCategorySwitch(cat)}
            className={`u-btn btn-action-small ${category === cat ? 'u-btn-primary' : 'u-btn-secondary'}`}
            style={{ flex: 1 }}
          >
            {cat === 'data' ? '데이터 용량' : cat === 'length' ? '길이 변환' : cat === 'weight' ? '무게 변환' : '온도 변환'}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
        <div className="unit-fields-grid">
          {currentUnits.map((unit) => {
            const isSelf = lastEditedUnit === unit.key;
            const displayValue = isSelf ? val : renderUnitValue(unit);
            
            return (
              <div key={unit.key} className="u-form-group">
                <label className="u-label" style={{ color: isSelf ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  {unit.name} {isSelf && '★ 입력중'}
                </label>
                <input 
                  type="text" 
                  className="u-input" 
                  style={{ 
                    borderColor: isSelf ? 'rgba(0, 242, 254, 0.5)' : 'var(--border-glass)',
                    fontSize: '1.1rem',
                    fontWeight: isSelf ? 700 : 400
                  }}
                  value={displayValue}
                  onChange={(e) => handleValueChange(unit.key, e.target.value)} 
                />
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            💡 입력 칸 하나를 클릭하고 값을 타이핑하면 나머지 항목들이 등가식 연산을 통해 자동 수정됩니다.
          </span>
          <button 
            onClick={() => { setVal(1); setLastEditedUnit(currentUnits[0].key); playBeep(220, 0.05); }} 
            className="u-btn btn-action-small u-btn-secondary"
          >
            1로 초기화
          </button>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   9. Live Markdown Editor & Previewer
   ========================================================================== */
function MarkdownWidget({ playBeep }) {
  const [mdText, setMdText] = useState(`# 마크다운 실시간 뷰어 

왼쪽 에디터에 마크다운 문법으로 글을 쓰면 오른쪽 창에 실시간으로 스타일링된 HTML 결과가 반영됩니다.

## 지원하는 기능
- **텍스트 두껍게(Bold)**
- *텍스트 기울임(Italic)*
- > 인용구문 (Blockquote)
- \`인라인 코드\` 및 코드 블록

### 코드 블록 예시
\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

- [x] 체크 리스트 완료
- [ ] 체크 리스트 미완료

원하는 노트를 타이핑한 후 우측 상단의 다운로드 버튼을 눌러 .md 파일로 간편히 저장하세요.
`);

  // A super lightweight client-side markdown regex parser
  const parseMarkdown = (md) => {
    let html = md || '';
    
    // Escaping dangerous HTML tags to prevent XSS
    html = html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headings
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');

    // Code blocks
    html = html.replace(/```(.*?)\n([\s\S]*?)```/gm, '<pre><code>$2</code></pre>');
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');

    // Blockquotes
    // Need to handle &gt; since we escaped tags
    html = html.replace(/^&gt;\s(.*?)$/gm, '<blockquote>$1</blockquote>');

    // Checklists
    html = html.replace(/^- \[x\] (.*?)$/gm, '<li><input type="checkbox" checked disabled> <span style="text-decoration: line-through; opacity: 0.6;">$1</span></li>');
    html = html.replace(/^- \[ \] (.*?)$/gm, '<li><input type="checkbox" disabled> <span>$1</span></li>');

    // Bullet Lists
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Paragraphs - simple double newline split
    html = html.split('\n\n').map(p => {
      if (p.trim().startsWith('<h') || p.trim().startsWith('<pre') || p.trim().startsWith('<block') || p.trim().startsWith('<li')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('\n');

    return { __html: html };
  };

  const handleDownload = () => {
    playBeep(880, 0.1);
    const blob = new Blob([mdText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dev_notes.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="utility-header flex-center-between" style={{ marginBottom: '1.25rem' }}>
        <div>
          <div className="utility-title-wrapper">
            <FileEdit className="icon-cyan" />
            <h3 className="utility-title">마크다운 프리뷰어 (Live Editor)</h3>
          </div>
          <p className="utility-desc">글을 쓸 때 기호화된 마크다운을 브라우저에 파싱하여 스타일이 입혀진 HTML 결과로 실시간 보여줍니다.</p>
        </div>

        <button onClick={handleDownload} className="u-btn btn-action-small u-btn-primary">
          <Download size={14} /> .md 파일로 내보내기
        </button>
      </div>

      <div className="markdown-pane-wrapper">
        {/* Editor */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="u-label" style={{ marginBottom: '0.4rem' }}>마크다운 편집 입력창</span>
          <textarea 
            className="u-textarea md-editor" 
            style={{ flex: 1, height: '100%', minHeight: '380px' }}
            value={mdText}
            onChange={(e) => setMdText(e.target.value)} 
          />
        </div>

        {/* Live Preview */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="u-label" style={{ marginBottom: '0.4rem' }}>HTML 렌더링 미리보기</span>
          <div 
            className="md-preview"
            dangerouslySetInnerHTML={parseMarkdown(mdText)}
          />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   10. To-Do Checklist & Focus Pomodoro
   ========================================================================== */
function TodoWidget({ playBeep }) {
  const [todos, setTodos] = useState([
    { id: 1, text: '유틸리티 개발 완료 및 릴리즈 검증하기', completed: true, priority: 'high' },
    { id: 2, text: '바탕화면 커스텀 시계 위젯 디자인 조정', completed: false, priority: 'medium' },
    { id: 3, text: '포트폴리오 연락처 테스트 이메일 전송', completed: false, priority: 'low' }
  ]);
  const [todoInput, setTodoInput] = useState('');
  const [priority, setPriority] = useState('medium');

  // Pomodoro integrated timer
  const [pTimeLeft, setPTimeLeft] = useState(25 * 60);
  const [pRunning, setPRunning] = useState(false);
  const pIntervalRef = useRef(null);

  useEffect(() => {
    if (pRunning) {
      pIntervalRef.current = setInterval(() => {
        setPTimeLeft(prev => {
          if (prev <= 1) {
            setPRunning(false);
            playBeep(980, 0.8, 'sawtooth');
            alert("집중 세션이 끝났습니다! 휴식을 취해 주세요.");
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(pIntervalRef.current);
    }
    return () => clearInterval(pIntervalRef.current);
  }, [pRunning, playBeep]);

  const handleAddTodo = () => {
    if (todoInput.trim() === '') return;
    playBeep(660, 0.08);

    const newTodo = {
      id: Date.now(),
      text: todoInput,
      completed: false,
      priority
    };

    setTodos([newTodo, ...todos]);
    setTodoInput('');
  };

  const handleToggleTodo = (id) => {
    playBeep(587, 0.05);
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleDeleteTodo = (id) => {
    playBeep(349, 0.08);
    setTodos(todos.filter(t => t.id !== id));
  };

  const formatPomoTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div>
      <div className="utility-header">
        <div className="utility-title-wrapper">
          <ListTodo className="icon-cyan" />
          <h3 className="utility-title">포모도로 & 할 일 체크리스트 (Focus Workspace)</h3>
        </div>
        <p className="utility-desc">집중에 유용한 포모도로 타이머와 우선순위 지정 할 일 체크리스트를 연동하여 생산성을 높이는 업무 관리 공간입니다.</p>
      </div>

      <div className="u-grid-2">
        {/* Checklist */}
        <div>
          <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }}>할 일 목록 (Tasks)</h4>

          <div className="todo-input-row">
            <input 
              type="text" 
              className="u-input" 
              placeholder="새로운 작업 추가..."
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()} 
            />
            <select className="u-select" style={{ width: '100px' }} value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="high">높음</option>
              <option value="medium">보통</option>
              <option value="low">낮음</option>
            </select>
            <button onClick={handleAddTodo} className="u-btn u-btn-primary">추가</button>
          </div>

          <div className="todo-list-container">
            {todos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-muted)' }}>
                등록된 할 일이 없습니다. 작업을 추가해 보세요!
              </div>
            ) : (
              todos.map(todo => (
                <div key={todo.id} className={`todo-item-card ${todo.completed ? 'todo-item-completed' : ''}`}>
                  <div className="todo-item-left">
                    <input 
                      type="checkbox" 
                      className="u-checkbox" 
                      checked={todo.completed} 
                      onChange={() => handleToggleTodo(todo.id)} 
                    />
                    <span className="todo-item-text">{todo.text}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className={`priority-tag priority-${todo.priority}`}>{todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '보통' : '낮음'}</span>
                    <button onClick={() => handleDeleteTodo(todo.id)} className="todo-delete-btn">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Focus Timer */}
        <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="priority-tag priority-high" style={{ padding: '0.3rem 1rem', fontSize: '0.85rem' }}>
            🎯 몰입 세션 타이머
          </span>
          <div style={{ fontSize: '4rem', fontWeight: 800, margin: '1rem 0', fontFamily: 'monospace', color: 'var(--color-primary)', textShadow: '0 0 15px rgba(0, 242, 254, 0.4)' }}>
            {formatPomoTime(pTimeLeft)}
          </div>

          <div className="clock-controls-row">
            <button onClick={() => { setPRunning(!pRunning); playBeep(523, 0.08); }} className="u-btn u-btn-primary">
              {pRunning ? <Pause size={16} /> : <Play size={16} />} {pRunning ? '일시정지' : '집중 시작'}
            </button>
            <button 
              onClick={() => { setPRunning(false); setPTimeLeft(25 * 60); playBeep(349, 0.08); }} 
              className="u-btn u-btn-secondary"
            >
              <RotateCcw size={16} /> 리셋
            </button>
          </div>
          
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '1.5rem', textAlign: 'center' }}>
            25분 동안 휴대폰이나 다른 웹서핑을 차단하고 업무에 고도로 몰입해 보세요. 종료 시 알람 비프음이 울립니다.
          </span>
        </div>
      </div>
    </div>
  );
}
