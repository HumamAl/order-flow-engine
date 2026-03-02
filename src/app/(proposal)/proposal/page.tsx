"use client";

import { profile, portfolioProjects } from "@/data/proposal";
import { APP_CONFIG } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  Search,
  Wrench,
  Rocket,
  TrendingUp,
  Briefcase,
  Clock,
  Zap,
} from "lucide-react";

const stepIcons = [Search, Wrench, Rocket, TrendingUp];

export default function ProposalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Hero Section — full-width dark ── */}
      <div className="w-full bg-[color:var(--section-dark)]">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)]/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span className="text-xs font-mono text-white/50 tracking-wider uppercase">
              Built this demo for your project
            </span>
          </div>

          {/* Name + tagline */}
          <h1 className="text-3xl font-light text-white/60 mb-3">
            Hi, I&apos;m{" "}
            <span className="font-black text-white">{profile.name}</span>
          </h1>
          <p className="text-base text-white/70 leading-relaxed max-w-2xl mb-8">
            {profile.tagline}
          </p>

          {/* Social proof stats */}
          <div className="flex flex-wrap gap-8">
            {[
              { icon: Briefcase, label: "projects shipped", value: "24+" },
              { icon: Zap, label: "industries", value: "15+" },
              { icon: Clock, label: "demo turnaround", value: "< 48hr" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-white/40">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content sections ── */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-14">
        {/* ── Proof of Work ── */}
        <section>
          <h2 className="text-xl font-semibold mb-1">Relevant Projects</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Backend systems and operational tools I&apos;ve built that relate to
            this job.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioProjects.map((project) => (
              <div
                key={project.id}
                className="aesthetic-card p-5 flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm">{project.title}</h3>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 shrink-0 transition-colors inline-flex items-center gap-1 text-xs"
                    >
                      View Live
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {project.description}
                </p>
                {project.relevance && (
                  <p className="text-xs text-primary font-medium mb-3">
                    {project.relevance}
                  </p>
                )}
                {project.outcome && (
                  <>
                    <Separator className="mb-3" />
                    <p className="text-sm font-medium text-[color:var(--success)]">
                      {project.outcome}
                    </p>
                  </>
                )}
                <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
                  {project.tech.map((t) => (
                    <Badge
                      key={t}
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-none"
                    >
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── How I Work ── */}
        <section>
          <h2 className="text-xl font-semibold mb-1">How I Work</h2>
          <p className="text-sm text-muted-foreground mb-6">
            A structured approach tuned for backend and infrastructure projects.
          </p>
          <div className="space-y-0">
            {profile.approach.map((step, i) => {
              const Icon = stepIcons[i] ?? Wrench;
              return (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-md flex items-center justify-center shrink-0 text-xs font-bold font-mono",
                        "bg-primary text-primary-foreground"
                      )}
                    >
                      {i + 1}
                    </div>
                    {i < profile.approach.length - 1 && (
                      <div className="w-px flex-1 bg-border/60 my-1" />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                      <p className="text-sm font-medium">{step.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2 pl-13">
            Expect visible progress within the first week.
          </p>
        </section>

        <Separator />

        {/* ── Skills Grid ── */}
        <section>
          <h2 className="text-xl font-semibold mb-1">Skills</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Tech I use for projects like this.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {profile.skillCategories.map((category) => (
              <div
                key={category.name}
                className="aesthetic-card p-4"
              >
                <h3 className="text-sm font-medium mb-3">{category.name}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {category.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-none"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator />

        {/* ── CTA Section — full-width dark ── */}
        <section
          className="rounded-lg p-8 space-y-4"
          style={{ background: "var(--section-dark)" }}
        >
          {/* Pulsing availability */}
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)]/60 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span className="text-xs text-white/50">Currently available</span>
          </div>

          <h2 className="text-xl font-light text-white/60">
            Let&apos;s build{" "}
            <span className="font-bold text-white">
              {APP_CONFIG.projectName}
            </span>{" "}
            together
          </h2>

          <p className="text-sm text-white/50 leading-relaxed max-w-lg">
            This demo is a starting point. I can have the production version
            scoped and started within days of your reply.
          </p>

          <p className="text-sm font-medium text-primary">
            Reply on Upwork to start
          </p>

          <p className="text-xs text-white/40 leading-relaxed">
            10-minute call or I can send a 2-slide plan — your pick.
          </p>

          <p className="text-sm text-white/40 pt-2">— Humam</p>
        </section>
      </div>
    </div>
  );
}
