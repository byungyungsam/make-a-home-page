import React, { useState, useEffect } from 'react';
import { GitBranch, GitCommit, ExternalLink, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function GitUpdates() {
  const [commits, setCommits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommits = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('https://api.github.com/repos/byungyungsam/make-a-home-page/commits?per_page=5');
      if (!response.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await response.json();
      setCommits(data);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
      // Fallback fallback mock commits in case of rate limits or offline mode
      setCommits([
        {
          sha: '371866c98692cb00257e841ad025e6c70b8956e1',
          html_url: 'https://github.com/byungyungsam/make-a-home-page/commit/371866c98692cb00257e841ad025e6c70b8956e1',
          commit: {
            message: 'Initial commit: 홈페이지 제작 시작 및 README 작성',
            author: {
              name: 'byun',
              date: new Date().toISOString()
            }
          },
          author: {
            avatar_url: 'https://github.com/byungyungsam.png'
          }
        }
      ]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCommits();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  return (
    <section id="git-updates" className="git-updates-section relative py-20 px-6 max-w-7xl mx-auto z-10">
      {/* Title */}
      <div className="section-title-wrapper text-center mb-12">
        <h2 className="section-title text-4xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
          <GitBranch className="text-[#00f2fe] w-8 h-8 animate-pulse" /> Live Development Logs
        </h2>
        <p className="showcase-subtitle text-gray-400 mt-2">
          깃허브 레포지토리의 최신 커밋 내역을 실시간으로 가져와 보여줍니다.
        </p>
        <div className="section-divider w-24 h-1 bg-gradient-to-r from-[#00f2fe] to-[#9b51e0] mx-auto mt-4 rounded-full" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Dashboard Panel */}
        <div className="lg:col-span-1 glass-panel p-6 rounded-2xl border border-white/10 bg-[#131520]/80 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00f2fe]/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
              배포 및 업데이트 상태
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-sm text-gray-400">자동 배포 상태</span>
                <span className="flex items-center gap-1.5 text-emerald-400 text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> Active (CI/CD)
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-sm text-gray-400">연결된 레포지토리</span>
                <a 
                  href="https://github.com/byungyungsam/make-a-home-page" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 hover:underline transition-colors"
                >
                  make-a-home-page <ExternalLink className="w-3. h-3" />
                </a>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-sm text-gray-400">기본 브랜치</span>
                <span className="text-sm font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  main
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {error ? '임시 로컬 로그 표시 중' : '실시간 동기화 완료'}
            </span>
            <button 
              onClick={fetchCommits} 
              disabled={refreshing}
              className="p-2 rounded-lg bg-[#00f2fe]/10 hover:bg-[#00f2fe]/20 text-[#00f2fe] transition-all hover:scale-105 disabled:opacity-50"
              title="새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Commit History Panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/10 bg-[#131520]/80 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#9b51e0]/5 rounded-full blur-3xl pointer-events-none" />

          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
            최근 업데이트 내역 (Changelog)
          </h3>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <RefreshCw className="w-8 h-8 text-[#00f2fe] animate-spin" />
              <p className="text-sm text-gray-400">깃허브에서 최신 변경 내역을 가져오는 중...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {error && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg text-xs flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  GitHub API 요청 제한으로 임시 또는 로컬 데이터가 로드되었습니다.
                </div>
              )}
              
              {commits.map((item, index) => (
                <div 
                  key={item.sha} 
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Commiter Avatar */}
                  <img 
                    src={item.author?.avatar_url || 'https://github.com/identicons/byun.png'} 
                    alt={item.commit.author.name}
                    className="w-10 h-10 rounded-full border border-white/10 bg-white/5 mt-1" 
                  />

                  {/* Commit Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-[#f3f4f6]">
                        {item.commit.author.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(item.commit.author.date)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 leading-relaxed font-sans mb-2 break-words">
                      {item.commit.message}
                    </p>

                    <div className="flex items-center gap-3">
                      {/* Short SHA Link */}
                      <a 
                        href={item.html_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-[#00f2fe] hover:text-[#00f2fe]/80 font-mono flex items-center gap-1 transition-colors"
                      >
                        <GitCommit className="w-3.5 h-3.5" />
                        {item.sha.substring(0, 7)}
                      </a>

                      <span className="text-[10px] flex items-center gap-1 text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        Deployed
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
