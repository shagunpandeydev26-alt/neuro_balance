import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { useNeuro } from "@/lib/neuro-store";
import { Vote, Check, ThumbsUp, ThumbsDown } from "lucide-react";

export default function DAO() {
  const { user } = useAuth();
  const { proposals, voteOnProposal, stats } = useNeuro();

  const handleVote = (id: string, choice: "for" | "against") => {
    voteOnProposal(id, choice);
    toast.success(`Vote cast: ${choice === "for" ? "For" : "Against"}`, {
      description: "Your governance vote has been recorded.",
    });
  };

  return (
    <Layout isLoggedIn walletAddress={user?.walletAddress} showSidebar>
      <div className="px-4 md:px-8 py-8 max-w-4xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-2">
              DAO Governance
            </h1>
            <p className="text-muted-foreground">
              Vote on proposals shaping the NeuroBalance ecosystem.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-wellness-900/30 border border-wellness-700 rounded-lg">
            <Vote className="h-5 w-5 text-wellness-400" />
            <span className="text-sm text-wellness-400">
              Voting power:{" "}
              <span className="font-semibold">{stats.balance} SOC</span>
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {proposals.map((p) => {
            const total = p.votesFor + p.votesAgainst;
            const forPct = total ? Math.round((p.votesFor / total) * 100) : 0;
            return (
              <div
                key={p.id}
                className="glass rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="text-lg font-bold text-foreground">
                    {p.title}
                  </h3>
                  <span className="text-xs font-medium uppercase tracking-wide px-2 py-1 rounded-full bg-growth-500/15 text-growth-500 whitespace-nowrap">
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  {p.description}
                </p>

                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{p.votesFor} For</span>
                  <span>{p.votesAgainst} Against</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-5 flex">
                  <div
                    className="h-full bg-growth-500"
                    style={{ width: `${forPct}%` }}
                  />
                  <div
                    className="h-full bg-destructive"
                    style={{ width: `${100 - forPct}%` }}
                  />
                </div>

                {p.voted ? (
                  <div className="flex items-center gap-2 text-sm text-growth-500 font-medium">
                    <Check className="h-4 w-4" />
                    You voted {p.voted === "for" ? "For" : "Against"}
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleVote(p.id, "for")}
                      className="flex-1 bg-growth-500 hover:bg-growth-600 text-white gap-2"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      For
                    </Button>
                    <Button
                      onClick={() => handleVote(p.id, "against")}
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10 gap-2"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Against
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
