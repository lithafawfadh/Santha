import React, { useState } from "react";
import { User, Edit3, X, Sun, Moon, Save, Calendar, DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { GlassButton } from "@/components/ui/glass-button";
import { Card, CardContent } from "@/components/ui/card";
import ShaderBackground from "@/components/ui/shader-background";

export default function MemberPortal() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);

  const currentUser = { name: "Ali", username: "ali03" };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const logout = () => alert("Logged out!");
  const handleUsernameUpdate = () => {
    setIsUpdatingUsername(true);
    setTimeout(() => {
      setIsUpdatingUsername(false);
      setIsEditingUsername(false);
    }, 1000);
  };
  const cancelUsernameEdit = () => setIsEditingUsername(false);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gradient-to-br from-gray-900 to-black" : "bg-gradient-to-br from-indigo-600 via-purple-700 to-blue-800"
      } text-white transition-all duration-500`}
    >
      <ShaderBackground opacity={0.3} />

      {/* HEADER */}
      <header className="backdrop-blur-xl bg-white/10 dark:bg-gray-900/20 border-b border-white/20 dark:border-gray-700/30 shadow-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 gap-4">
            {/* Left: Title + Welcome */}
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-white drop-shadow">Member Portal</h1>
                <p className="text-sm text-white/80">Welcome, {currentUser?.name}</p>
              </div>
            </div>

            {/* Right: Actions Row */}
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
              {/* Username Display / Edit */}
              <div className="flex items-center gap-2 backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                <User className="h-4 w-4 text-white/70" />
                {isEditingUsername ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="px-2 py-1 text-sm bg-white/20 border border-white/30 rounded focus:ring-2 focus:ring-green-500 text-white placeholder-white/50"
                      placeholder="New username"
                      disabled={isUpdatingUsername}
                    />
                    <GlassButton
                      variant="primary"
                      onClick={handleUsernameUpdate}
                      disabled={isUpdatingUsername}
                      className="p-1"
                    >
                      <Save className="h-4 w-4" />
                    </GlassButton>
                    <GlassButton
                      variant="secondary"
                      onClick={cancelUsernameEdit}
                      disabled={isUpdatingUsername}
                      className="p-1"
                    >
                      <X className="h-4 w-4" />
                    </GlassButton>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-white/90 truncate max-w-[100px]">@{currentUser?.username}</span>
                    <GlassButton
                      variant="secondary"
                      onClick={() => setIsEditingUsername(true)}
                      className="p-1"
                    >
                      <Edit3 className="h-3 w-3" />
                    </GlassButton>
                  </div>
                )}
              </div>

              {/* Rightmost Actions */}
              <div className="flex items-center gap-2">
                {/* Dark Mode Toggle */}
                <GlassButton variant="secondary" onClick={toggleDarkMode} className="p-2">
                  {isDarkMode ? (
                    <Sun className="h-4 w-4 text-yellow-400" />
                  ) : (
                    <Moon className="h-4 w-4 text-white" />
                  )}
                </GlassButton>

                {/* Logout Button (icon-only on mobile) */}
                <GlassButton
                  variant="secondary"
                  onClick={logout}
                  className="hidden sm:flex px-3 py-2 text-sm font-medium"
                >
                  Logout
                </GlassButton>

                <GlassButton
                  variant="secondary"
                  onClick={logout}
                  className="sm:hidden p-2"
                >
                  <X className="h-4 w-4 text-white" />
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN DASHBOARD */}
      <main className="max-w-3xl mx-auto py-6 px-4 flex flex-col gap-4">
        <Card className="bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-lg">
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="text-sm text-white/70">Months Paid</p>
              <h2 className="text-2xl font-bold">9/12</h2>
            </div>
            <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-lg">
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="text-sm text-white/70">Amount Paid</p>
              <h2 className="text-2xl font-bold">LKR 2,700</h2>
            </div>
            <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-lg">
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="text-sm text-white/70">Group Funds</p>
              <h2 className="text-2xl font-bold">LKR 26,700</h2>
            </div>
            <div className="h-10 w-10 rounded-lg bg-purple-500 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-lg">
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <p className="text-sm text-white/70">Outstanding Loans</p>
              <h2 className="text-2xl font-bold">LKR 0</h2>
            </div>
            <div className="h-10 w-10 rounded-lg bg-orange-500 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
